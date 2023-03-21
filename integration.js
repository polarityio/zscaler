'use strict';

const { map } = require('lodash/fp');

const { setLogger, getLogger } = require('./src/logger');
const { polarityRequest } = require('./src/polarity-request');
const { obfuscateApiKey } = require('./src/obfuscate-api-key');
const { parseErrorToReadableJSON } = require('./src/errors');
const { categoryLookup } = require('./src/category-lookup');
const { PolarityResult } = require('./src/create-result-object');
const { addUrl } = require('./src/add-url');
const { removeUrl } = require('./src/remove-url');

let Logger = null;

const startup = (logger) => {
  Logger = logger;
  setLogger(Logger);
};

/**
 * @param entities
 * @param options
 * @param cb
 * @returns {Promise<void>}
 */

//TODO: cache the token, and the category data when the user selects a category
//TODO: add validate options functions
async function doLookup (entities, options, cb) {
  try {
    const Logger = getLogger();

    polarityRequest.setOptions(options);
    polarityRequest.MAX_RETRIES = 3;
    polarityRequest.setHeader({
      'Content-Type': 'application/json'
    });

    const session = await createSession(options);
    Logger.trace({ session }, 'Created  Session');

    polarityRequest.setHeader('cookie', session.headers['set-cookie']);
    /*
     this is creating results with no data, this is specific to this integration. 
     we just want the blocks to be rendered in the overlay without making any api calls.
    */
    const polarityResult = new PolarityResult();
    const lookupResults = map(
      (entity) => polarityResult.createEmptyBlock(entity),
      entities
    );
    Logger.trace({ lookupResults }, 'Lookup Results');
    return cb(null, lookupResults);
  } catch (error) {
    if (error instanceof AuthRequestError) {
      if (polarityRequest.currentRetries < polarityRequest.MAX_RETRIES) {
        delete polarityRequest.headers['cookie'];
        const session = await createSession(options);
        polarityRequest.setHeader('cookie', session.headers['set-cookie']);
        polarityRequest.currentRetries++;
        /* 
         after we create a new session, we call the request again with the same options.
        */
        return polarityRequest.send(polarityRequest.requestOptions);
      }
    }
    const errorAsPojo = parseErrorToReadableJSON(error);
    Logger.error({ error: errorAsPojo }, 'Error in doLookup');
    cb(errorAsPojo);
  }
}

async function createSession (options) {
  const timestamp = new Date().getTime().toString();
  const apiKey = obfuscateApiKey(timestamp, options.token);

  const sessionRequestOptions = {
    method: 'POST',
    path: '/api/v1/authenticatedSession',
    body: {
      apiKey,
      username: options.username,
      password: options.password,
      timestamp
    }
  };

  const session = await polarityRequest.request(sessionRequestOptions);
  return session;
}

async function onMessage (payload, options, cb) {
  const Logger = getLogger();
  Logger.trace({ payload }, 'Payload');
  try {
    switch (payload.action) {
      case 'CATEGORY_LOOKUP':
        cb(null, await categoryLookup(payload));
        break;
      case 'ADD_URL':
        cb(null, await addUrl(payload));
        break;
      case 'REMOVE_URL':
        cb(null, await removeUrl(payload));
        break;
      default:
        cb(null, 'No action found');
    }
  } catch (error) {
    /* 
      removed the AuthRequestError for now, don't want to call session in here, 
      need to handle expiring auth token
    */
    const errorAsPojo = parseErrorToReadableJSON(error);
    Logger.error({ error: errorAsPojo }, 'Error in onMessage');
    cb(errorAsPojo);
  }
}

module.exports = {
  startup,
  doLookup,
  onMessage
};

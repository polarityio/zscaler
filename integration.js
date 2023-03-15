'use strict';

const { map } = require('lodash/fp');

const { setLogger, getLogger } = require('./src/logger');
const { polarityRequest } = require('./src/polarity-request');
const { categoryLookup } = require('./src/category-lookup');
const { createResultObject } = require('./src/create-result-object');
const { obfuscateApiKey } = require('./src/obfuscate-api-key');
const { AuthRequestError } = require('./src/errors');
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

async function doLookup (entities, options, cb) {
  try {
    const Logger = getLogger();

    polarityRequest.setOptions(options);
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
    const lookupResults = map((entity) => createResultObject(entity), entities);
    Logger.trace({ lookupResults }, 'Lookup Results');

    return cb(null, lookupResults);
  } catch (error) {
    if (error instanceof AuthRequestError) {
      // this needs to be fixed, there is bugs in the code.
      delete polarityRequest.headers['cookie'];
      const session = await createSession(polarityRequest.options);
      polarityRequest.setHeader('cookie', session.headers['set-cookie']);

      return polarityRequest.send(polarityRequest.requestOptions);
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
}

module.exports = {
  startup,
  doLookup,
  onMessage
};

// const validateOption = (errors, options, optionName, errMessage) => {
//   if (!(typeof options[optionName].value === 'string' && options[optionName].value)) {
//     errors.push({
//       key: optionName,
//       message: errMessage
//     });
//   }
// };

// const validateOptions = (options, callback) => {
//   let errors = [];

//   validateOption(errors, options, 'url', 'You must provide an api url.');
//   validateOption(errors, options, 'apiToken', 'You must provide a valid access key.');

//   callback(null, errors);
// };

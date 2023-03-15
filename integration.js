'use strict';

const { map } = require('lodash/fp');

const { setLogger, getLogger } = require('./src/logger');
const { polarityRequest } = require('./src/polarity-request');
const { urlLookup } = require('./src/url-lookup');
const { createResultObject } = require('./src/create-result-object');
const { obfuscateApiKey } = require('./src/obfuscate-api-key');
const { AuthRequestError, RetryRequestError } = require('./src/errors');
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

    const timestamp = new Date().getTime().toString();
    const apiKey = obfuscateApiKey(timestamp, options.token);

    polarityRequest.setHeader({
      'Content-Type': 'application/json'
    });
    //create session to get JSESSIONID cookie
    const session = await polarityRequest.request({
      method: 'POST',
      path: '/api/v1/authenticatedSession',
      body: {
        apiKey,
        username: options.username,
        password: options.password,
        timestamp
      }
    });
    Logger.trace({ session }, 'Created  Session');
    // setting cookie header
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
      delete this.headers['cookie'];
      const session = await createSession(this.options);
      this.setHeader('cookie', session.headers['set-cookie']);
    }

    if (error instanceof RetryRequestError) {
      polarityRequest.retries += 1;

      if (polarityRequest.retries <= 3) {
        return polarityRequest.send(polarityRequest.requestOptions);
      }
    }

    Logger.error({ error }, 'Error');
    cb(error);
  }
}

async function onMessage (payload, options, cb) {
  const Logger = getLogger();

  const actions = {
    ADD_URL: await addUrl(payload),
    CATEGORY_LOOKUP: await urlLookup(payload),
    REMOVE_URL: await removeUrl(payload)
  };

  const response = actions[payload.action];

  Logger.trace({ response }, 'Response');

  cb(null, response);
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

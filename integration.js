'use strict';

const { setLogger, getLogger } = require('./src/logger');
const { polarityRequest } = require('./src/polarity-request');
const { urlLookup } = require('./src/url-lookup');
const { createResultObject } = require('./src/create-result-object');
const { map } = require('lodash/fp');

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

    const requestOptions = {
      method: 'POST',
      path: '/api/v1/authenticatedSession',
      body: {
        apiKey,
        username: options.username,
        password: options.password,
        timestamp
      }
    };
    Logger.trace({ requestOptions }, 'Authenticated Session Request Options');
    //create session to get JSESSIONID cookie
    const session = await polarityRequest.request(requestOptions);
    Logger.trace({ session }, 'Created  Session');
    // setting cookie header
    polarityRequest.setHeader('cookie', session.headers['set-cookie']);

    const urls = await urlLookup(entities);
    Logger.trace({ urls }, 'URL lookup Response');

    const lookupResults = map((result) => {
      return createResultObject(result);
    }, urls);
    Logger.trace({ lookupResults }, 'Lookup Results');

    return cb(null, lookupResults);
  } catch (error) {
    Logger.error({ error }, 'Error');
    cb(error);
  }
}

function obfuscateApiKey (timestamp, key) {
  let high = timestamp.substring(timestamp.length - 6);
  let low = (parseInt(high) >> 1).toString();
  let apiKey = '';

  while (low.length < 6) {
    low = '0' + low;
  }

  for (var i = 0; i < high.length; i++) {
    apiKey += key.charAt(parseInt(high.charAt(i)));
  }

  for (var j = 0; j < low.length; j++) {
    apiKey += key.charAt(parseInt(low.charAt(j)) + 2);
  }

  return apiKey;
}

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

module.exports = {
  startup,
  doLookup
};

'use strict';

// const { map, reduce } = require('lodash/fp');

const { setLogger, getLogger } = require('./src/logger');
// const { parseErrorToReadableJSON } = require('./src/errors');
// const { polarityRequest } = require('./src/polarity-request');
const { createSession } = require('./src/create-session');
// const { getUrlCatagories } = require('./src/get-url-catagories');
// const { createResultObject } = require('./src/create-result-object');

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
    // polarityRequest.setOptions(options);
    // polarityRequest.setHeader({
    //   'Content-Type': 'application/json'
    // });

    const session = await createSession(options);

    //createSession returns an object with a headers property that contains JESSIONID,
    // which needs to be present in the headers of all subsequent requests.
    // polarityRequest.setHeader('cookie', session[0].result.headers['set-cookie']);

    // const urlCategories = await getUrlCatagories(entities);
  } catch (error) {
    // Logger.error({ error }, 'Unable to create session');
  }
}

// const validateOption = (errors, options, optionName, errMessage) => {
//   if (!(typeof options[optionName].value === "string" && options[optionName].value)) {
//     errors.push({
//       key: optionName,
//       message: errMessage
//     });
//   }
// };

// const validateOptions = (options, callback) => {
//   let errors = [];

//   validateOption(errors, options, "url", "You must provide an api url.");
//   validateOption(errors, options, "apiToken", "You must provide a valid access key.");

//   callback(null, errors);
// };

// DATA SOURCES:

module.exports = {
  startup,
  doLookup
  // validateOptions,
  // Logger
};

// So the integration works with domains
// When a user searches on a domain the integration will always return a result
// The result will either have an "Add to category" button or a "Remove from category" button depending on whether the domain is already in the category or not
// I haven't checked the API yet so not sure how easy that is to do
// I don't think we even need to run a search until maybe onDetails?
// I guess it depends on performance of that category search

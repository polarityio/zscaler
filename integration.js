'use strict';

const { map } = require('lodash/fp');
const { setLogger, getLogger } = require('./src/logger');
const { polarityRequest } = require('./src/polarity-request');
const { obfuscateApiKey } = require('./src/obfuscate-api-key');
const { parseErrorToReadableJSON, AuthRequestError } = require('./src/errors');
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
async function doLookup(entities, options, cb) {
  try {
    const Logger = getLogger();

    // This is creating results with no data, this is specific to this integration.
    // we just want the blocks to be rendered in the overlay without making any api calls.
    const polarityResult = new PolarityResult();
    const lookupResults = map(
      (entity) => polarityResult.createEmptyBlock(entity),
      entities
    );
    Logger.trace({ lookupResults }, 'Lookup Results');
    return cb(null, lookupResults);
  } catch (error) {
    const errorAsPojo = parseErrorToReadableJSON(error);
    Logger.error({ error: errorAsPojo }, 'Error in doLookup');
    cb(errorAsPojo);
  }
}

async function createSession(options) {
  polarityRequest.setOptions(options);
  polarityRequest.setHeader({
    'Content-Type': 'application/json'
  });
  const timestamp = new Date().getTime().toString();
  const apiKey = obfuscateApiKey(timestamp, options.token);
  // setting the authorizedRequestOptions on the polarityRequest object so we can used fot the retry logic
  polarityRequest.authorizedRequestOptions = {
    method: 'POST',
    path: 'api/v1/authenticatedSession',
    body: {
      apiKey,
      username: options.username,
      password: options.password,
      timestamp
    }
  };

  const session = await polarityRequest.request(polarityRequest.authorizedRequestOptions);
  Logger.trace({ session }, 'Created  Session');
  polarityRequest.setHeader('cookie', session.headers['set-cookie']);
}

async function onMessage(payload, options, cb) {
  const Logger = getLogger();
  Logger.trace({ payload }, 'Payload');
  try {
    switch (payload.action) {
      case 'CATEGORY_LOOKUP':
        await createSession(options);
        cb(null, await categoryLookup(payload));
        break;
      case 'ADD_URL':
        await createSession(options);
        cb(null, await addUrl(payload));
        break;
      case 'REMOVE_URL':
        await createSession(options);
        cb(null, await removeUrl(payload));
        break;
      default:
        cb(null, 'No action found');
    }
  } catch (error) {
    const errorAsPojo = parseErrorToReadableJSON(error);
    Logger.error({ error: errorAsPojo }, 'Error in onMessage');
    cb(errorAsPojo);
  }
}

function validateOptions(userOptions, cb) {
  const errors = [];

  if (
    typeof userOptions.url.value !== 'string' ||
    (typeof userOptions.url.value === 'string' && userOptions.url.value.length === 0)
  ) {
    errors.push({
      key: 'url',
      message: 'You must provide a URL'
    });
  }

  if (
      typeof userOptions.url.value !== 'string' ||
      (typeof userOptions.url.value === 'string' && userOptions.url.value.includes('/api'))
  ) {
    errors.push({
      key: 'url',
      message: 'URL should not include /api/v1 path.'
    });
  }

  if (
      typeof userOptions.url.value !== 'string' ||
      (typeof userOptions.url.value === 'string' && !userOptions.url.value.startsWith('https://'))
  ) {
    errors.push({
      key: 'url',
      message: 'URL must start with `https://`'
    });
  }

  if (
    typeof userOptions.username.value !== 'string' ||
    (typeof userOptions.username.value === 'string' &&
      userOptions.username.value.length === 0)
  ) {
    errors.push({
      key: 'username',
      message: 'You must provide a username'
    });
  }

  if (
    typeof userOptions.password.value !== 'string' ||
    (typeof userOptions.password.value === 'string' &&
      userOptions.password.value.length === 0)
  ) {
    errors.push({
      key: 'password',
      message: 'You must provide a password'
    });
  }

  if (
    typeof userOptions.token.value !== 'string' ||
    (typeof userOptions.token.value === 'string' && userOptions.token.value.length === 0)
  ) {
    errors.push({
      key: 'token',
      message: 'You must provide a valid API key'
    });
  }

  if (
    typeof userOptions.categories.value !== 'string' ||
    (typeof userOptions.categories.value === 'string' &&
      userOptions.categories.value.length === 0)
  ) {
    errors.push({
      key: 'categories',
      message: 'Please provide a category to add or remove the URL from'
    });
  }

  cb(null, errors);
}

module.exports = {
  startup,
  doLookup,
  onMessage,
  validateOptions
};

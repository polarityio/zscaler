const { get } = require('lodash/fp');
const { getLogger } = require('./logger');

/**
 * Return a Result Object or a Result Miss Object based on the REST API response.
 * @param entity - entity object
 * @param apiResponse - response object from API Rest request
 * @returns {{data: null, entity}|{data: {summary: [string], details}, entity}}
 */
const createResultObject = (result) => {
  const Logger = getLogger();

  return {
    entity: result.entity,
    data: {
      summary: createSummaryTags(result),
      details: {
        urls: result.url
      }
    }
  };
};

const createSummaryTags = (resultsForThisEntity) => {
  const tags = [];
  const Logger = getLogger();

  return tags;
};

/**
 * Okta API returns a 404 status code if a particular IP has no data on it.
 *
 * @param apiResponse
 * @returns {boolean}
 */

module.exports = { createResultObject };

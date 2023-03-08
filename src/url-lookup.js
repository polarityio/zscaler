const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');
const { map, find, forEach } = require('lodash/fp');

async function urlLookup (entities) {
  let results;
  const Logger = getLogger();

  const urlList = map((entity) => entity.value, entities);

  const requestOptions = {
    method: 'POST',
    path: '/api/v1/urlLookup',
    body: urlList
  };

  const response = await polarityRequest.send(requestOptions);
  Logger.trace({ response }, 'URL Lookup api response');

  forEach((result) => {
    results = associateEntitiesWithResults(entities, result);
  }, response);

  Logger.trace({ results }, 'results');
  return results;
}

const associateEntitiesWithResults = (entities, obj) => {
  const Logger = getLogger();

  const entitiesWithResults = map((entity) => {
    const result = find((r) => r.url === entity.value, obj.result.body);

    return {
      entity,
      url: result
    };
  }, entities);

  Logger.trace({ entitiesWithResults }, 'entitiesWithResults');
  return entitiesWithResults;
};

module.exports = { urlLookup };

const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');
const { find } = require('lodash/fp');

async function urlLookup (payload) {
  const Logger = getLogger();

  const requestOptions = {
    entity: payload.data.entity,
    method: 'GET',
    path: `/api/v1/urlCategories/${payload.data.category}`
  };

  Logger.trace({ requestOptions }, 'Request Options');

  const response = await polarityRequest.send(requestOptions);
  Logger.trace({ response }, 'URL Lookup api response');

  for (const obj of response) {
    if (domainIsInCategory(obj)) {
      obj.result.body.inCategory = true;
    } else {
      obj.result.body.inCategory = false;
    }
  }

  Logger.trace({ response }, 'URL Lookup api response');
  return response;
}

function domainIsInCategory (response) {
  const value = response.entity.value;
  const dbCategorizedUrls = response.result.body.dbCategorizedUrls;

  const found = find((url) => {
    return url === value;
  }, dbCategorizedUrls);

  return found;
}

module.exports = { urlLookup };

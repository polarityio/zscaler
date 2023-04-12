const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');

async function removeUrl(payload) {
  const Logger = getLogger();

  const CATEGORY = payload.data.category.trim();
  const CONFIGURED_NAME = payload.data.configuredName;

  const response = await polarityRequest.send({
    method: 'PUT',
    path: `/api/v1/urlCategories/${CATEGORY}?action=REMOVE_FROM_LIST`,
    body: {
      configuredName: CONFIGURED_NAME,
      dbCategorizedUrls: [payload.data.entity.value]
    }
  });

  Logger.trace({ response }, 'URL Lookup api response');
  return response;
}

module.exports = { removeUrl };

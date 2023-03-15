const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');

async function removeUrl (payload) {
  const Logger = getLogger();

  Logger.trace({ data: payload.data.category }, 'DDDDDD');

  const response = await polarityRequest.send({
    method: 'PUT',
    path: `/api/v1/urlCategories/${payload.data.category.trim()}?action=REMOVE_TO_LIST`,
    body: {
      configuredName: payload.data.configuredName,
      urls: [payload.data.entity.value]
    }
  });

  Logger.trace({ response }, 'URL Lookup api response');
  return response;
}

module.exports = { removeUrl };

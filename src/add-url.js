const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');

async function addUrl(payload) {
  const Logger = getLogger();

  try {
    Logger.trace({ data: payload.data.category }, 'DDDDDD');

    const CATEGORY = payload.data.category.trim();

    Logger.trace({ data: payload.data.category }, 'DDDDDD');

    const response = await polarityRequest.send({
      method: 'PUT',
      path: `/api/v1/urlCategories/MUSIC?action=ADD_TO_LIST`,
      body: {
        // configuredName: payload.data.configuredName,
        // urls: [payload.data.entity.value]
        // id: 'CUSTOM_1',
        superCategory: 'ENTERTAINMENT_AND_RECREATION',
        dbCategorizedUrls: ['test5.com']
      }
    });

    Logger.trace({ response }, 'URL Lookup api response');
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = { addUrl };

// set default category
// fix add url
// add super category as a user option
// error messages, template, styles.
// fix footnotes in the overlay

const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');

async function addUrl (payload) {
  const Logger = getLogger();

  const response = await polarityRequest.send({
    method: 'PUT',
    path: `/api/v1/urlCategories/${payload.data.category.trim()}?action=ADD_TO_LIST`,
    body: {
      superCategory: 'ENTERTAINMENT_AND_RECREATION',
      urls: ['asdasdsad.com'],
      dbCategorizedUrls: [payload.data.entity.value]
    }
  });

  Logger.trace({ response }, 'URL Lookup api response');
  return response;
}

module.exports = { addUrl };


// set default category
// fix add url 
// add super category as a user option
// error messages, template, styles.
// fix footnotes in the overlay  
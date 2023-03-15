const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');
const { map } = require('lodash/fp');

async function removeUrl (entities) {
  //   let results;
  //   const Logger = getLogger();
  //   const response = await polarityRequest.send({
  //     method: 'PUT',
  //     path: `/api/v1/urlCategories/${polarityRequest.options.category
  //       .trim()
  //       .toUpperCase()}?action=ADD_TO_LIST`,
  //     body: {
  //       superCategory: polarityRequest.options.superCategory,
  //       url: entities[0].value, // DON'T FORGET TO CHANGE THIS
  //       dbCategorizedUrls: ['test.com']
  //     }
  //   });
  //   Logger.trace({ response }, 'URL Lookup api response');
  //   Logger.trace({ results }, 'results');
  //   return results;
}

module.exports = { removeUrl };

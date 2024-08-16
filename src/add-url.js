const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');

async function addUrl(payload) {
  const Logger = getLogger();

  const CATEGORY = payload.data.category.trim();
  const CONFIGURED_NAME = payload.data.configuredName;

  const response = await polarityRequest.send({
    method: 'PUT',
    path: `api/v1/urlCategories/${CATEGORY}?action=ADD_TO_LIST`,
    body: {
      id: CATEGORY,
      configuredName: CONFIGURED_NAME,
      dbCategorizedUrls: [payload.data.entity.value]
    }
  });

  Logger.trace({ response }, 'URL Lookup api response');
  return response;
}

//TODO: going to leave this here for testing until add/remove url from predefined categories is working
// async function addUrl(payload) {
//   const Logger = getLogger();

//   try {
//     const CATEGORY = payload.data.category.trim();
//     const CONFIGURED_NAME = payload.data.configuredName;

//     const response = await polarityRequest.send({
//       method: 'PUT',
//       path: `api/v1/urlCategories/ENTERTAINMENT_AND_RECREATION?action=ADD_TO_LIST`,
//       body: {
//         superCategory: 'OTHER_ENTERTAINMENT_AND_RECREATION',
//         dbCategorizedUrls: [payload.data.entity.value]
//       }
//     });

//     Logger.trace({ response }, 'URL Lookup api response');
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

module.exports = { addUrl };

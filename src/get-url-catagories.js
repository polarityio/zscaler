// const { polarityRequest } = require('./polarity-request');
// const { getLogger } = require('./logger');
// const { map } = require('lodash/fp');

// async function getUrlCatagories (entities) {
//   const Logger = getLogger();

//   Logger.trace({ entities }, 'Polarity Request CREATE SESSION');

//   const urlList = map((entity) => entity.value, entities);

//   Logger.trace({ urlList }, 'url list');

//   const requestOptions = {
//     method: 'POST',
//     path: '/api/v1/urlLookup',
//     body: urlList
//   };

//   const response = await polarityRequest.send(requestOptions);

//   Logger.trace({ response }, 'url categories response');
//   return response;
// }

// module.exports = { getUrlCatagories };

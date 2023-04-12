const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');
const { find, forEach } = require('lodash/fp');
//ideally, we would cache the results of this function, as it is going to be called
// anytime a user selects a category from the dropdown.
async function categoryLookup(payload) {
  const Logger = getLogger();

  Logger.trace({ payload }, 'Payload');

  const requestOptions = {
    entity: payload.data.entity,
    method: 'GET',
    path: `/api/v1/urlCategories/${payload.data.category.trim()}`
  };
  Logger.trace({ requestOptions }, 'Request Options');

  const response = await polarityRequest.send(requestOptions);
  Logger.trace({ response }, 'raw response');
  /* 
     setting a property on the response object to indicate if the domain is in the category. 
     this is used to determine if the add or remove button should be displayed in the overlay.
  */
  forEach((obj) => (obj.result.body.inCategory = domainIsInCategory(obj)), response);

  Logger.trace({ response }, 'URL Lookup api response');
  return response;
}

//TODO: this function may need to be changed for pre-defined categories.
function domainIsInCategory(response) {
  const value = response.entity.value;
  const dbCategorizedUrls = response.result.body.dbCategorizedUrls;

  const found = find((url) => url === value, dbCategorizedUrls);

  return found;
}

module.exports = { categoryLookup };

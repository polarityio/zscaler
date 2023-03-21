const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');
const { find } = require('lodash/fp');

//ideally, we would cache the results of this function, as it is going to be called
// anytime a user selects a category from the dropdown.
async function categoryLookup (payload) {
  const Logger = getLogger();

  Logger.trace({ payload }, 'Payload');

  const requestOptions = {
    entity: payload.data.entity,
    method: 'GET',
    path: `/api/v1/urlCategories/${payload.data.category.trim()}`
  };

  Logger.trace({ requestOptions }, 'Request Options');

  const response = await polarityRequest.send(requestOptions);
  Logger.trace({ response }, 'URL Lookup api response');
  /* setting a property on the response object to indicate if the domain is in the category. 
     this is used to determine if the add or remove button should be displayed in the overlay.
  */
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

module.exports = { categoryLookup };

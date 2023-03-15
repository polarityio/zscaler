const { getLogger } = require('./logger');
/**
 * Return a Result Object or a Result Miss Object based on the REST API response.
 * @param null || {entity, result}
 * if I pass nothing in, I want it to return a result object with no data
 * if i pass in a single object, I want it to return a result object with data
 * either pass in a single object or an array of objects, being
 * @returns {{data: null, entity}|{data: {summary: [string], details}, entity}}
 */
const createResultObject = (arguments) => {
  const Logger = getLogger();
  Logger.trace({ arguments }, 'createResultObject arguments');

  if (Object.keys(arguments).length <= 1) {
    const { entity, result } = arguments;
    return {
      entity,
      data: {
        summary: createSummaryTags(result),
        details: {
          urls: result.body
        }
      }
    };
  } else {
    return {
      entity: arguments,
      data: {
        summary: [arguments.value],
        details: []
      }
    };
  }
};

const createSummaryTags = (result) => {
  const tags = [];
  tags.push(`Category: ${result.body.configuredName}`);
  return tags;
};

module.exports = { createResultObject };

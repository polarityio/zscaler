const { polarityRequest } = require('./polarity-request');
const { getLogger } = require('./logger');

async function createSession (options) {
  const Logger = getLogger();
  Logger.trace({ options }, 'Options');
  // const Logger = getLogger();
  // const timestamp = new Date().getTime().toString();
  // const apiKey = obfuscateApiKey(timestamp, options.token);

  // const requestOptions = {
  //   method: 'POST',
  //   path: '/api/v1/authenticatedSession',
  //   body: {
  // apiKey,
  // username: options.username,
  // password: options.password,
  // timestamp
  //   }
  // };

  // Logger.trace({ requestOptions }, 'Create Session Request');
  // Logger.trace({ ADDA: polarityRequest.options }, 'Timestamp');

  const response = await polarityRequest.request('asdas');
  // polarityRequest.setHeader('set-cookie', session.headers['set-cookie']);
  // Logger.trace({ requestOptions }, 'AAAAe');
  // return response;
}

function obfuscateApiKey (timestamp, key) {
  let high = timestamp.substring(timestamp.length - 6);
  let low = (parseInt(high) >> 1).toString();
  let apiKey = '';

  while (low.length < 6) {
    low = '0' + low;
  }

  for (var i = 0; i < high.length; i++) {
    apiKey += key.charAt(parseInt(high.charAt(i)));
  }

  for (var j = 0; j < low.length; j++) {
    apiKey += key.charAt(parseInt(low.charAt(j)) + 2);
  }

  return apiKey;
}

module.exports = {
  createSession
};

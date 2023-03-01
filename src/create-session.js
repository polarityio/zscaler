const { polarityRequest } = require("../src/polarity-request");
const { getLogger } = require("./logger");

async function createSession (options) {
  const Logger = getLogger();
  const timestamp = new Date().getTime().toString();

  const apiKey = obfuscateApiKey(timestamp, options.apiKey);

  const requestOptions = {
    method: "POST",
    path: "/authenticatedSession",
    body: {
      apiKey,
      username: options.username,
      password: options.password,
      timestamp: options.timestamp
    }
  };

  const response = await polarityRequest.send(requestOptions);

  Logger.trace({ response }, "Create Session Response");
}

function obfuscateApiKey (timestamp, key) {
  let high = timestamp.substring(timestamp.length - 6);
  let low = (parseInt(high) >> 1).toString();
  let apiKey = "";

  while (low.length < 6) {
    low = "0" + low;
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

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
  obfuscateApiKey
};

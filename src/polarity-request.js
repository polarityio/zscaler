const fs = require("fs");
const request = require("postman-request");
const { getLogger } = require("./logger");
const { NetworkError } = require("./errors");
const {
  request: { ca, cert, key, passphrase, rejectUnauthorized, proxy }
} = require("../config/config.js");
const { map } = require("lodash/fp");
const { parallelLimit } = require("async");

const _configFieldIsValid = (field) => typeof field === "string" && field.length > 0;

const defaults = {
  ...(_configFieldIsValid(ca) && { ca: fs.readFileSync(ca) }),
  ...(_configFieldIsValid(cert) && { cert: fs.readFileSync(cert) }),
  ...(_configFieldIsValid(key) && { key: fs.readFileSync }),
  ...(_configFieldIsValid(passphrase) && { passphrase }),
  ...(_configFieldIsValid(proxy) && { proxy }),
  ...(typeof rejectUnauthorized === "boolean" && { rejectUnauthorized }),
  json: true
};

const HTTP_CODE_EXPIRED_BEARER_TOKEN_401 = 401;

const HTTP_CODE_TOKEN_MISSING_PERMISSIONS_OR_REVOKED_403 = 403;

const HTTP_CODE_SERVER_LIMIT_500 = 500;
const HTTP_CODE_SERVER_LIMIT_502 = 502;
const HTTP_CODE_SERVER_LIMIT_504 = 504;

const HTTP_CODE_API_LIMIT_REACHED_429 = 429;

const HTTP_CODE_SUCCESS_200 = 200;
const HTTP_CODE_SUCCESS_201 = 201;
const HTTP_CODE_SUCCESS_202 = 202;

class PolarityRequest {
  constructor () {
    this.requestWithDefaults = request.defaults(defaults);
  }
  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *    res.set('Foo', ['bar', 'baz']);
   *    res.set('Accept', 'application/json');
   *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   *
   * @param {String|Object} field
   * @param {String|Array} val
   * @public
   */
  setHeader (key, value) {
    if (arguments.length === 2) {
      this.headers = {
        [key]: value
      };
    } else {
      for (let key in field) {
        this.headers = {
          [key]: field[key]
        };
      }
    }
  }

  setOptions (options) {
    this.options = options;
  }

  /**
   * Makes a request network request using postman-request.  If the request is an array, it will run the requests in parallel.
   * @param requestOptions  - the request options to pass to postman-request. It will either being an array of requests or a single request.
   * @returns {{Promise<*>} || {Promise<Array<*>>}}- returns a promise that resolves to the response from the request
   */
  async request (requestOptions) {
    this.requestOptions.method = requestOptions.method || "GET";
    this.requestOptions.url = this.options.url + requestOptions.path;
    this.requestOptions.headers = this.headers;
    this.requestOptions.body = requestOptions.body || {};

    return new Promise(async (resolve, reject) => {
      this.requestWithDefaults(requestOptions, (err, response) => {
        if (err) {
          return reject(
            new NetworkError("Unable to complete network request", {
              cause: err,
              requestOptions
            })
          );
        }

        resolve({
          ...response,
          requestOptions
        });
      });
    });
  }

  async runRequestsInParallel (requestOptions, limit = 10) {
    const Logger = getLogger();

    Logger.trace({ requestOptions }, "Parallel Requests");

    if (!Array.isArray(requestOptions)) {
      requestOptions = [requestOptions];
    }

    const unexecutedRequestFunctions = map(
      ({ entity, ...singleRequestOptions }) =>
        async () => {
          const result = await this.request(singleRequestOptions);
          return result ? { entity, result } : result;
        },
      requestOptions
    );

    return parallelLimit(unexecutedRequestFunctions, limit);
  }

  async send (requestOptions) {
    await this.runRequestsInParallel(requestOptions);
  }
}

module.exports = {
  polarityRequest: new PolarityRequest()
};

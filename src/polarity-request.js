const fs = require('fs');
const request = require('postman-request');
const Bottleneck = require('bottleneck');
const { getLogger } = require('./logger');
const { NetworkError, ApiRequestError, RetryRequestError } = require('./errors');
const { createSession } = require('./create-session');
const {
  request: { ca, cert, key, passphrase, rejectUnauthorized, proxy }
} = require('../config/config.js');
const { map } = require('lodash/fp');
const { parallelLimit } = require('async');

const _configFieldIsValid = (field) => typeof field === 'string' && field.length > 0;

const defaults = {
  ...(_configFieldIsValid(ca) && { ca: fs.readFileSync(ca) }),
  ...(_configFieldIsValid(cert) && { cert: fs.readFileSync(cert) }),
  ...(_configFieldIsValid(key) && { key: fs.readFileSync }),
  ...(_configFieldIsValid(passphrase) && { passphrase }),
  ...(_configFieldIsValid(proxy) && { proxy }),
  ...(typeof rejectUnauthorized === 'boolean' && { rejectUnauthorized }),
  json: true
};

// const HTTP_CODE_BAD_REQUEST_400 = 400;
// const HTTP_CODE_EXPIRED_BEARER_TOKEN_401 = 401;
// const HTTP_CODE_TOKEN_MISSING_PERMISSIONS_OR_REVOKED_403 = 403;
// const HTTP_CODE_API_LIMIT_REACHED_429 = 429;

// const HTTP_CODE_SERVER_LIMIT_500 = 500;
// const HTTP_CODE_SERVER_LIMIT_502 = 502;
// const HTTP_CODE_SERVER_LIMIT_504 = 504;

// const HTTP_CODE_SUCCESS_200 = 200;
// const HTTP_CODE_SUCCESS_201 = 201;
// const HTTP_CODE_SUCCESS_202 = 202;

class PolarityRequest {
  constructor () {
    this.requestWithDefaults = request.defaults(defaults);
    // this.headers = {};
    // this.options = {};
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
  // setHeader (field, value) {
  //   const Logger = getLogger();
  //   // need to add mime type to the request in a generic way
  //   if (arguments.length === 2) {
  //     this.headers = {
  //       [field]: value
  //     };
  //   } else {
  //     for (let key in field) {
  //       Logger.trace({ key, field: field[key] }, 'Setting Header');
  //       this.headers[key] = field;
  //     }
  //   }
  // }

  // setOptions (options) {
  //   this.options = options;
  // }
  /**
   * Makes a request network request using postman-request.  If the request is an array, it will run the requests in parallel.
   * @param requestOptions  - the request options to pass to postman-request. It will either being an array of requests or a single request.
   * @returns {{Promise<*>} || {Promise<Array<*>>}}- returns a promise that resolves to the response from the request
   */
  async request (opts) {
    const Logger = getLogger();
    Logger.trace({ ASDASDASDASD: 11111111111111111 }, 'Request Options');

    const reqOpts = {
      method: 'POST',
      url: 'https://zsapi.zscalerbeta.net/api/v1/authenticatedSession',
      headers: this.headers
      // ...opts
    };

    Logger.trace({ reqOpts }, 'Request Options');

    // const { path, ...requestOptions } = reqOpts;

    // return new Promise(async (resolve, reject) => {
    //   this.requestWithDefaults('asdassads', (err, response) => {
    //     Logger.trace({ err, response }, 'Request Response');
    //     if (err) {
    //       return reject(
    //         new NetworkError('Unable to complete network request', {
    //           cause: err,
    //           requestOptions
    //         })
    //       );
    //     }

    //     resolve({
    //       ...response,
    //       requestOptions
    //     });
    //   });
    // });

    // const reqOpts = {
    //   method: opts.method,
    //   url: this.options.url + opts.path,
    //   headers: this.headers,
    //   ...opts
    // };

    // const { path, ...requestOptions } = reqOpts;

    // const requestOptions = {};

    // return new Promise((resolve, reject) => {
    //   this.requestWithDefaults(requestOptions, async (err, response) => {
    // Logger.trace({ err, response }, 'Request Response');
    // if (
    //   statusCode === HTTP_CODE_SUCCESS_200 ||
    //   statusCode === HTTP_CODE_SUCCESS_201 ||
    //   statusCode === HTTP_CODE_SUCCESS_202
    // ) {
    //   return resolve({ ...response, requestOptions });
    // }
    // if (statusCode === HTTP_CODE_BAD_REQUEST_400) {
    //   return reject(
    //     new ApiRequestError('Bad Request', {
    //       statusCode,
    //       requestOptions
    //     })
    //   );
    // }
    // if (statusCode === HTTP_CODE_EXPIRED_BEARER_TOKEN_401) {
    //   Logger.trace('Token Expired');
    //   const session = await createSession(this.options);
    //   this.setHeader('cookie', session[0].result.headers['set-cookie']);
    //   return resolve(this.request(requestOptions));
    // }
    // // need retry logic for 429, 500, 502, 504
    // if (statusCode === HTTP_CODE_API_LIMIT_REACHED_429) {
    //   return reject(
    //     new RetryRequestError('API Limit Reached', {
    //       statusCode,
    //       requestOptions
    //     })
    //   );
    // }
    // if (err) {
    //   if (
    //     statusCode === HTTP_CODE_SERVER_LIMIT_500 ||
    //     statusCode === HTTP_CODE_SERVER_LIMIT_502 ||
    //     statusCode === HTTP_CODE_SERVER_LIMIT_504
    //   ) {
    //     return reject(
    //       new NetworkError('Network error', {
    //         cause: err,
    //         requestOptions
    //       })
    //     );
    //   } else {
    //     return reject(
    //       new NetworkError('Unknown error', {
    //         cause: err,
    //         requestOptions
    //       })
    //     );
    //   }
    // }
    // });
    //   });
    // });
  }

  // async runRequestsInParallel (requestOptions, limit = 10) {
  //   const hasdas = this.request(requestOptions);
  // const Logger = getLogger();
  //  Logger.trace({ requestOptions }, 'Request Options (before request)');

  //  if (!Array.isArray(requestOptions)) {
  //   requestOptions = [requestOptions];
  // }

  // const unexecutedRequestFunctions = map(
  //   ({ entity, ...singleRequestOptions }) =>
  //     async () => {
  //       const result = await this.request(singleRequestOptions);
  //       return result ? { entity, result } : result;
  //     },
  //   requestOptions
  // );

  // return parallelLimit(unexecutedRequestFunctions, limit);
  // }

  // async send (requestOptions) {
  // const Logger = getLogger();
  // Logger.trace({ requestOptions }, 'Request Options (before request)');
  // return await this.runRequestsInParallel(requestOptions);
  // }
}

module.exports = {
  polarityRequest: new PolarityRequest()
};

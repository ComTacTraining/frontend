import { Component } from 'react';
import crypto from 'crypto';
import querystring from 'query-string';

export default class v4 extends Component {
  createCanonicalRequest = function(method, pathname, query, headers, payload) {
    return [
      method.toUpperCase(),
      pathname,
      this.createCanonicalQueryString(query),
      this.createCanonicalHeaders(headers),
      this.createSignedHeaders(headers),
      payload
    ].join('\n');
  };

  createCanonicalQueryString = function(params) {
    return Object.keys(params)
      .sort()
      .map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      })
      .join('&');
  };

  createCanonicalHeaders = function(headers) {
    return Object.keys(headers)
      .sort()
      .map(function(name) {
        return (
          name.toLowerCase().trim() +
          ':' +
          headers[name].toString().trim() +
          '\n'
        );
      })
      .join('');
  };

  createSignedHeaders = headers => {
    return Object.keys(headers)
      .sort()
      .map(function(name) {
        return name.toLowerCase().trim();
      })
      .join(';');
  };

  createCredentialScope = function(time, region, service) {
    return [this.toDate(time), region, service, 'aws4_request'].join('/');
  };

  createStringToSign = function(time, region, service, request) {
    return [
      'AWS4-HMAC-SHA256',
      this.toTime(time),
      this.createCredentialScope(time, region, service),
      this.hash(request, 'hex')
    ].join('\n');
  };

  createSignature = function(secret, time, region, service, stringToSign) {
    var h1 = this.hmac('AWS4' + secret, this.toDate(time)); // date-key
    var h2 = this.hmac(h1, region); // region-key
    var h3 = this.hmac(h2, service); // service-key
    var h4 = this.hmac(h3, 'aws4_request'); // signing-key
    return this.hmac(h4, stringToSign, 'hex');
  };

  createPresignedS3URL = function(name, options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.bucket = options.bucket || process.env.AWS_S3_BUCKET;
    return this.createPresignedURL(
      options.method,
      options.bucket + '.s3.amazonaws.com',
      '/' + name,
      's3',
      'UNSIGNED-PAYLOAD',
      options
    );
  };

  helloWorld() {
    console.log('Hello World');
  }

  createPresignedURL = (method, host, path, service, payload, options) => {
    options = options || {};
    options.key = options.key || process.env.AWS_ACCESS_KEY_ID;
    options.secret = options.secret || process.env.AWS_SECRET_ACCESS_KEY;
    options.protocol = options.protocol || 'https';
    options.headers = options.headers || {};
    options.timestamp = options.timestamp || Date.now();
    options.region = options.region || process.env.AWS_REGION || 'us-east-1';
    options.expires = options.expires || 86400; // 24 hours
    options.headers = options.headers || {};

    // host is required
    options.headers.Host = host;

    var query = options.query ? querystring.parse(options.query) : {};
    query['X-Amz-Algorithm'] = 'AWS4-HMAC-SHA256';
    query['X-Amz-Credential'] =
      options.key +
      '/' +
      this.createCredentialScope(options.timestamp, options.region, service);
    query['X-Amz-Date'] = this.toTime(options.timestamp);
    query['X-Amz-Expires'] = options.expires;
    query['X-Amz-SignedHeaders'] = this.createSignedHeaders(options.headers);
    if (options.sessionToken) {
      query['X-Amz-Security-Token'] = options.sessionToken;
    }

    var canonicalRequest = this.createCanonicalRequest(
      method,
      path,
      query,
      options.headers,
      payload
    );
    var stringToSign = this.createStringToSign(
      options.timestamp,
      options.region,
      service,
      canonicalRequest
    );
    var signature = this.createSignature(
      options.secret,
      options.timestamp,
      options.region,
      service,
      stringToSign
    );
    query['X-Amz-Signature'] = signature;
    return (
      options.protocol +
      '://' +
      host +
      path +
      '?' +
      querystring.stringify(query)
    );
  };

  toTime(time) {
    return new Date(time).toISOString().replace(/[:-]|\.\d{3}/g, '');
  }

  toDate(time) {
    return this.toTime(time).substring(0, 8);
  }

  hmac(key, string, encoding) {
    return crypto
      .createHmac('sha256', key)
      .update(string, 'utf8')
      .digest(encoding);
  }

  hash(string, encoding) {
    return crypto
      .createHash('sha256')
      .update(string, 'utf8')
      .digest(encoding);
  }
}

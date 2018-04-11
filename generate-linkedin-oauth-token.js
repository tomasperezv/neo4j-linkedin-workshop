/**
 * Simple script to generate the OAuth 2.0 authorization URL that is used to complete the first part
 * of the authentication against the Linkedin API.
 *
 * The user will have to open the generated URL in the browser and copy the OAuth access token.
 *
 * @see https://developer.linkedin.com/docs/oauth2
 */
const http = require('http');
const url = require('url');
const requestInterface = require('https');
const querystring = require('querystring');

const config = require('./config/my-linkedin-app.json');

const PORT = 3232;

// 1. Spawn a local webserver that will be used to capture the oauth access token
http.createServer((req, res) => {
  // Read the access token from the URI params
  const params = url.parse(req.url, true).query;

  // Write a valid response for the browser
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ success: true }));
  res.end();

  if (typeof params.code === 'undefined') {
    return;
  }

  const { connection: { remoteAddress } } = req;
  // eslint-disable-next-line no-console
  console.log(`Client visiting from ${remoteAddress}`);

  if (typeof params.code !== 'undefined') {
    exchangeAuthorizationCode(params.code); // eslint-disable-line no-use-before-define
  }
}).listen(PORT);

/**
 * 2. As a part of the OAuth flow, we have to exchange the authorization code to obtain
 * an access token.
 *
 * @method completeAuthorization
 * @param {code}
 */
const exchangeAuthorizationCode = (code) => {
  // eslint-disable-next-line no-console
  console.log('Processing callback, exchanging code for obtaining an access token');

  const data = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret
  });

  console.log(data); // eslint-disable-line no-console

  const options = {
    host: 'www.linkedin.com',
    port: '443',
    path: '/oauth/v2/accessToken',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length
    }
  };

  const req = requestInterface.request(options, (response) => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      // eslint-disable-next-line no-console
      console.log(`*** Exchange completed, update the configuration with your access token value:
${JSON.parse(body).access_token}`);

      process.exit();
    });
  });

  req.write(data);
  req.end();
};

// State is a unique string value used to prevent CSRF
// Not relevant for our use case but required by Linkedin API.
const state = Math.floor(Math.random(0, 1000) * 10000000);

// eslint-disable-next-line no-console
console.log(`
*** Generate Linkedin OAuth Token
Please, go to https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=${state}
and copy the result URL that will contain the oauth token to access to the Linkedin API.
`);

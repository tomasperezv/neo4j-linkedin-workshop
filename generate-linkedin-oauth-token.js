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

const config = require('./config/my-linkedin-app.json');
const PORT = 3232;

// 1. Spawn a local webserver that will be used to capture the oauth access token

const server = http.createServer(function(req, res) {
  const remoteAddress = req.connection.remoteAddress;
  console.log(`Client visiting from ${remoteAddress}`);

  // Write a valid response for the browser
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({ success: true }));
  res.end();

  // Read the access token from the URI params
  const params = url.parse(req.url, true).query;

  server.close(() => {
    console.log(`Oauth token obtained, closing the server gracefully`)
    console.log(`*** Update the configuration with your access token value:
${params.code}`);
    process.exit();
  });
}).listen(PORT);

// State is a unique string value used to prevent CSRF
// Not relevant for our use case but required by Linkedin API.
const state = Math.floor(Math.random(0, 1000)*10000000);

console.log(`
*** Generate Linkedin OAuth Token
Please, go to https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=${state}
and copy the result URL that will contain the oauth token to access to the Linkedin API.
`);

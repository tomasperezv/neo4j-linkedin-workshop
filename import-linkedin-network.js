/**
 * Imports the network of contacts from the Linkedin API.
 *
 * @see https://developer.linkedin.com/docs/oauth2
 * @see https://www.npmjs.com/package/node-linkedin
 */
const config = require('./config/my-linkedin-app.json');

const Linkedin = require('node-linkedin')(config.clientId, config.clientSecret, config.redirectUri);

const linkedinApiClient = Linkedin.init(config.accessToken, { mobileToken: 'mobile' });

linkedinApiClient.people.me(['id', 'first-name', 'last-name'], function(err, ind) {
  // Loads the profile of access token owner. 
  console.log(err);
  console.log(ind);
});

//linkedinApiClient.companies.name('linkedin', function(err, company) {
//  // Here you go 
//  console.log(err);
//  console.log(company);
//});

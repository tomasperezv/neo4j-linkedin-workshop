/**
 * Layer on top of the `node-linkedin` library used to enrich the information obtained from the
 * Github API.
 */
const linkedinConfig = require('../config/my-linkedin-app.json');
const Linkedin = require('node-linkedin')(linkedinConfig.clientId, linkedinConfig.clientSecret, linkedinConfig.redirectUri);

const linkedinApiClient = Linkedin.init(linkedinConfig.accessToken);

module.exports = (name) => {
  return new Promise(resolve => {
    linkedinApiClient.companies_search.name(name, 1, (err, result) => {
      let company = null;
      if (result && result.companies && result.companies.values) {
        company = result.companies.values[0];
      }

      resolve(company);
    });
  });
};

/**
 * Layer on top of the `node-linkedin` library used to enrich the information obtained from the
 * Github API.
 */
const Linkedin = require('node-linkedin')(config.clientId, config.clientSecret, config.redirectUri);

const linkedinConfig = require('./config/my-linkedin-app.json');

const linkedinApiClient = Linkedin.init(config.accessToken);

let count = 0;
linkedinApiClient.companies_search.name(company.name, 1, function(err, result) {
  console.log('Processing ' + company.name);
  console.log(result);
  if (result && result.companies && result.companies.values) {
    result.companies.values.forEach((c) => {
      writer.write({ name: company.name, technology: c.specialites.values.join(' ')});
    });

    count++;
    if (count > 2) {
      writer.end();
      process.exit();
    }
  }
});

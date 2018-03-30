/**
 * Imports the network of contacts from the Linkedin API.
 *
 * @see https://developer.linkedin.com/docs/oauth2
 * @see https://www.npmjs.com/package/node-linkedin
 */
const fs = require('fs');
const csv = require('csv-parser');
const csvWriter = require('csv-write-stream');
const config = require('./config/my-linkedin-app.json');

const writer = csvWriter();
writer.pipe(fs.createWriteStream('./dataset/network.csv'));

const Linkedin = require('node-linkedin')(config.clientId, config.clientSecret, config.redirectUri);

const linkedinApiClient = Linkedin.init(config.accessToken);

let count = 0;

fs.createReadStream('./dataset/startups1.csv')
  .pipe(csv())
  .on('data', (company) => {
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
  });

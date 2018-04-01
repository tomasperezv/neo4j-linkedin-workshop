/**
 * Imports the network of contacts from the Github API
 *
 * @see https://developer.linkedin.com/docs/oauth2
 * @see https://www.npmjs.com/package/node-linkedin
 */
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const githubApiClient = require('./core/github');
const linkedinApiClient = require('./core/linkedin');

/**
 * Writes the data to a local CSV file after completing the fetch process
 * from the Github and Linkedin APIs.
 *
 * @method writeDataExport
 */
const writeDataExport = (data) => {
  const writer = csvWriter();
  writer.pipe(fs.createWriteStream('./dataset/network.csv'));
  writer.write({ name: 'test', technology: 'JARL'});
};

const result = githubApiClient()
  .then((data) => {
    for (let login in data.followers) {
      const follower = data.followers[login];
      for (let j = 0; j < follower.orgs.length; j++) {
        const org = follower.orgs[j];
        linkedinApiClient(org.login)
          .then(company => {
            if (company !== null && company.specialties) {
              console.log(company.specialties.values);
            }
          });
      }
    }
  })
  .catch((error) => {
    console.log('Something went wrong fetching information from Github or Linkedin APIs', error);
  });

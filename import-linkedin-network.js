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
  //const writer = csvWriter();
  //writer.pipe(fs.createWriteStream('./dataset/network.csv'));
  console.log(data.followers['oscarsj'].orgs[0]);
};

const result = githubApiClient()
  .then((data) => {

    let pending = 0;
    const write = (data) => {
      pending--;

      if (pending === 0) {
        writeDataExport(data);
      }
    };

    for (let login in data.followers) {
      const follower = data.followers[login];
      for (let j = 0; j < follower.orgs.length; j++) {
        pending++;

        const org = follower.orgs[j];
        linkedinApiClient(org.login)
          .then(company => {
            if (company !== null && company.specialties) {
              follower.orgs[j].linkedin = company;
            }

            write(data);
          });
      }
    }
  })
  .catch((error) => {
    console.log('Something went wrong fetching information from Github or Linkedin APIs', error);
  });

/**
 * Layer on top of the `github-api` library that provides a way of obtaining the list
 * of followers of the current user.
 *
 */
const GitHub = require('github-api');
const githubConfig = require('../config/github.json');

const gh = new GitHub({
  username: githubConfig.username,
  token: githubConfig.accessToken
});

const result = {
  followers: {},
  orgs: {}
};

module.exports = () =>
  gh.getUser().listFollowers()
    .then((followers) => {
      // eslint-disable-next-line
      console.log(`Obtained your list of Github followers: ${followers.data.length}`);

      followers.data.forEach((follower) => {
        result.followers[follower.login] = follower;
        result.followers[follower.login].orgs = [];
      });

      return Promise.all(
        followers.data.map((follower) => {
          return new Promise(resolve => {
            gh.getUser(follower.login).listOrgs()
              .then((orgs) => {
                result.followers[follower.login].orgs = orgs.data;
                resolve(orgs);
              });
          });
        }));
    })
    .then((rawOrgs) => {
      // eslint-disable-next-line no-console
      console.log('Combining list of followers with their associated organization');

      let orgs = rawOrgs.map(org => org.data);
      orgs = orgs.reduce((acc, val) => acc.concat(val), []);

      result.orgs = orgs;

      return result;
});

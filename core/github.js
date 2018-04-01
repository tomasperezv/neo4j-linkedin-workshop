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

module.exports = () => {
  gh.getUser().listFollowers()
    .then((orgs) => {
      console.log(`Obtained your list of Github followers: ${orgs.data.length}`);
    })
};



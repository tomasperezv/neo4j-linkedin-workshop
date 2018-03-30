# neo4j-linkedin-workshop

A workshop for generating a neo4j graph based on the Linkedin contacts network

## Setup

### Prerequisite

You will require Node.js >= 8.0

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```

### Install the dependencies

We use the package [node-linkedin](https://www.npmjs.com/package/node-linkedin)
to access to the Linkedin API and import the list of contacts.

```bash
npm install
```

### Create the Linkedin Application for data import

1. Go to https://www.linkedin.com/developer/apps/new
2. Fill the needed fields
3. Add an authorized redirect URL with the value `http://localhost:3232/linkedin-workshop/callback`
4. Copy the Client ID` and `Client Secret` values

### Complete the configuration files

Copy the configuration file `./config/my-linkedin-app.json-example` to
`./config/my-linkedin-app.json` and edit it, adding the values obtained
in the previous step

```bash
$ cp ./config/my-linkedin-app.json-example ./config/my-linkedin-app.json
```

```json
{
  "clientId": "",
  "clientSecret": "",
  "redirectUri": "http://localhost:3232/linkedin-workshop/callback",
  "accessToken": ""
}
```

*Note:* At this point you don't have value for `accessToken`, ignore it
for the moment.

*Note:* `./config/my-linkedin-app.json` is added to the `.gitignore` so
you won't be able to commit by mistake your application secrets.

### Obtain an access token for your user

Linkedin uses OAuth 2.0, we are going to be importing your own network
of contacts, and for that we need you to obtain an OAuth access token.

To obtain the access token we need to open in a browser the
`oauth/v2/authorization` endpoint.

For that we can use the script `generate-linkedin-oauth-token.js`:

```
node generate-linkedin-oauth-token.js
```

This script will do 2 things:

1. It will generate the URL that you have to visit in the browser.
2. Then the browser will redirect to a local server (setup by this script) that is listening
on the 3232 port, that way we will capture automatically the oauth token.

### Import the network of contacts

For that, we are going to use the script `import-linkedin-network.js`

Some highlights from that script:

```
const Linkedin = require('node-linkedin')('app-id', 'secret', 'callback');
```

Here we are initializing the API client with the `Client ID`, `Client Secret` and `Authorized Redirect URL`

Those values are taken from environment variables: `APP_ID`, `SECRET`, `CALLBACK`, so you will require to pass them when running the script.

### Generate an access token for the Github API

Go to [Personal access tokens section](https://github.com/settings/tokens) and add a new access token to be able to access to the github API.

```bash
$ cp ./config/github.json-example ./config/github.json
```

Update `./config/github.json` with the generated token.

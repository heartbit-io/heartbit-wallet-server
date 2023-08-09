
# heartbit-wallet-server
HeartBit wallet server

## API endpoint
- TEST: (TODO)
- PROD: https://dev-wallet-api.heartbit.io

## Getting started 🐣
#### Dependencies

 - Requires [npm](https://www.npmjs.com/)
 - Requires [Postgres](https://www.postgresql.org/)

First, setup Postgres on your local or remote instance and obtain the connection url.

Rename `.env.example` to `.env` and populate the parameters.
`.env` file is located in 1password. (Name: `[prod] .env file / heartbit-wallet-server`)

You can use [NVM](https://github.com/nvm-sh/nvm) to install Node before proceeding to start the application by running the following commands:

```bash
# Run this to install Node 19.6.1
nvm install 19.6.1

# Run this to use the installed Node version 
nvm use 19.6.1

# clone the codebase to a directory
git clone git@github.com:heartbit-io/heartbit-wallet-server.git .

# cd into the directory and run the command
npm install

# start the application
npm run dev
```

## API Documentation

The API is documentation with Swagger and you can view using a browser client:

To view the documentation:

```bash
npm run dev

# then visit the url:
{host}:{PORT}/api/v1/documentation/
```

## Deploy(TEST is not yet, Now only Prod phase)

### Cloud Infra
- Cloudflare
- AWS Elastic beanstalk
  - PROD
    - Region: Seoul
    - t3.nano / t3.small
  - DEV, TEST 
    - (TODO)
- AWS RDS
  - PROD
    - Region: Seoul
    - Aurora PostgreSQL
    - db.r5.large
  - DEV, TEST 
    - (TODO)

### Description(Deployment setting files)
- .ebextensions/proxy.config: Port forwarding 8080 to 3000.
- .elasticbeanstalk/config.yml: elasticbeanstalk deploy config

### Pre-requisites
- Follow [eb setup script](https://github.com/aws/aws-elastic-beanstalk-cli-setup) with aws heartbit account
- setup .elasticbeanstalk/config.yml from 1password(name: [dev] elasticbeanstalk config)

### Process
1. Move to heartbit-wallet-server directory
2. Checkout branch for deploy
3. Terminal command

```bash
npm run build
eb deploy [enviroment-name]
```
- Replace [enviroment-name] each phase
    - PROD: dev-heartbit-wallet-server-env
    - DEV, TEST: (TODO)

e.g 
```bash
npm run build
eb deploy dev-heartbit-wallet-server-env
```


## 3rd parties

### Sentry
- Free plan
- Docs: https://docs.sentry.io/api/
- For error monitoring, alert

#### Set up guide
- Create project(express), required each enviroments
- Set sentry dns in env(SENTRY_DSN)
- Slack notification setting
  1. Select sentry project > settings > integrations > slack (add installation)
  2. Select sentry project > alerts > new alert rule > set 'Send a notification to the {workspace} Slack workspace to #{channel}'
- How to use in code
  - Write code like the example below where you want to receive the error alert
```
// e.g
Sentry.captureMessage('[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}');
```
- You can access Sentry via a notification in slack channel to see more information about the error.
- If you don't have a sentry account, find david(david@heartbit.io).


### CoinPaprika
- Free API
- Docs: https://api.coinpaprika.com/
- To get BTC price information

### ChatGPT
- Admin account: contact@heartbit.io
- Docs: https://platform.openai.com/docs/introduction
- To get ChatGPT answers

### DeepL
- Admin account: developer@heartbit.io
- Docs: https://www.deepl.com/docs-api/
- For translations (support 29 languages: https://www.deepl.com/docs-api/translate-text)

### Airtable
- Admin account: contact@heartbit.io
- Docs: https://airtable.com/developers/web
- For pseudo-registry management
- How to get doctor ID?
  - Step1: Get our doctor list
    - ```curl "https://api.airtable.com/v0/app3e1owkd49rNgQ6/tblUobsmfb6hoUiX7" -H "Authorization: Bearer [AIRTABLE_API_KEY]" ```
  - Step2: Searching doctor in step1 response

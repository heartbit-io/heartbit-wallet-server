
# heartbit-wallet-server
HeartBit wallet server

## API endpoint
- DEV, TEST: https://dev-wallet-api.heartbit.io
- PROD: (TODO)

## Getting started 🐣
#### Dependencies

 - Requires [npm](https://www.npmjs.com/)
 - Requires [Postgres](https://www.postgresql.org/)

First, setup Postgres on your local or remote instance and obtain the connection url.

Rename `.env.example` to `.env` and populate the parameters.

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

## Deploy(Prod is not yet)

### Cloud Infra
- Cloudflare
- AWS Elastic beanstalk
  - DEV, TEST 
    - Region: Seoul
    - t3.nano / t3.small
  - PROD
    - (TODO)
- AWS RDS
  - DEV, TEST 
    - Region: Seoul
    - Aurora PostgreSQL
    - db.r5.large
  - PROD
    - (TODO)

### Description
- .ebextensions/proxy.config: Port forwarding 8080 to 3000.
- .elasticbeanstalk/config.yml: elasticbeanstalk deploy config

### Pre-requisites
- Follow [eb setup script](https://github.com/aws/aws-elastic-beanstalk-cli-setup) with aws heartbit account
- setup .elasticbeanstalk/config.yml from 1password(name: [dev] elasticbeanstalk config)

### Process
1. Move to heartbit-wallet-server directory
2. Checkout develop branch for deploy
3. Terminal command

```bash
eb deploy [enviroment-name]
```

- Replace [enviroment-name] to
    - DEV, TEST: dev-heartbit-wallet-server-env
    - PROD: (TODO)

## Monitoring

### Sentry
- create project(express), required each enviroments
- set sentry dns in env(SENTRY_DSN)
- slack notification setting
  1. select sentry project > settings > integrations > slack (add installation)
  2. select sentry project > alerts > new alert rule > set 'Send a notification to the {workspace} Slack workspace to #{channel}'
- how to use in code
  - Write code like the example below where you want to receive the error alert
```
// e.g
Sentry.captureMessage('[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}');
```
- You can access Sentry via a notification in slack channel to see more information about the error.
- If you don't have a sentry account, find david(david@heartbit.io).

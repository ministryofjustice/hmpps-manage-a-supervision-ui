# Manage a Supervision UI

[![Repository Standards](https://img.shields.io/badge/dynamic/json?color=blue&logo=github&label=MoJ%20Compliant&query=%24.message&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-manage-a-supervision-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-report/hmpps-manage-a-supervision-ui "Link to report")

User interface for the Manage a Supervision service.

Try it out in the dev environment: https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/

## Get started

### Pre-requisites

You'll need to install:

* [Node 20.x](https://nodejs.org/download/release/latest-v20.x)*
* [Docker](https://www.docker.com/)

*If you're already using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), run:
`nvm install --latest-npm` at the project root to install the correct Node version automatically.

### Dependencies

Install NPM package dependencies:

```shell
npm install
```

### Run the service

To run the service locally, with an in-memory session store and local user account, run:

```shell
npm run start:dev
```

Open http://localhost:3000 in your browser.

### Integrate with dev services

Alternatively, you can integrate your local UI with the dev/test services deployed on MOJ Cloud Platform.
This removes the need for using Docker.

Create a `.env` file at the root of the project:

```properties
NODE_ENV=development
ENVIRONMENT=dev
REDIS_ENABLED=false
HMPPS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
MANAGE_USERS_API_URL=https://manage-users-api-dev.hmpps.service.justice.gov.uk
MAS_API_URL=https://manage-supervision-and-delius-dev.hmpps.service.justice.gov.uk
ARNS_API_URL=https://assess-risks-and-needs-dev.hmpps.service.justice.gov.uk
TIER_API_URL="https://hmpps-tier-dev.hmpps.service.justice.gov.uk"
TIER_LINK="https://tier-dev.hmpps.service.justice.gov.uk/case"
DELIUS_LINK=https://ndelius.test.probation.service.justice.gov.uk
INTERVENTIONS_API_URL=http://localhost:9091/interventions
INTERVENTIONS_LINK=https://hmpps-interventions-ui-dev.apps.live-1.cloud-platform.service.justice.gov.uk

```

Run the following to grab client credentials from the dev namespace:

```shell
kubectl -n hmpps-manage-a-supervision-dev get secret hmpps-manage-people-on-probation-ui -o json \
| jq -r '.data | map_values(@base64d) | to_entries[] | "\(.key)=\(.value)"' \
| grep CLIENT >> .env
```

Then, start the UI service:

```shell
npm run start:dev
```

## Formatting

### Check formatting

`npm run lint`

### Fix formatting

`npm run lint:fix`

## Testing

### Run unit tests

`npm run test`

### Running integration tests

To run the Cypress integration tests locally:

```shell
# Start the UI in test mode
npm run start-feature:dev

# Run the tests in headless mode:
npm run int-test

# Or, run the tests with the Cypress UI:
npm run int-test-ui
```

### Running end-to-end tests
Create a `.env` file in the e2e_tests directory with your Delius credentials. You can use `.env.example` as a template.
```shell
cp -n .env.example .env
```

Run the tests
```shell
npm run e2e-test

# Or, run in debug mode to enable breakpoints and test recorder
npm run e2e-test:debug
```

### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

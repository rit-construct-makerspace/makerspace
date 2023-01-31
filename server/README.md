## Our Two Docker Containers

We're using [Docker containers](https://www.docker.com/resources/what-container) to ensure
consistent development and deployment environments across the board, regardless of the
operating system, installed software, etc.

`db` — This container runs our [PostgreSQL database](https://www.postgresql.org/about/). Runs on port `5432`.

`testdb` — This container runs a postgres database which is used for running tests. Runs on port `5433`.

`server` — This container runs our [Apollo GraphQL server](https://www.apollographql.com/docs/apollo-server/).
This is where the business logic for the backend happens. It also exposes a GraphQL API
endpoint for our frontend to call. Runs on port `3000`.

## Prerequisites

1. You'll need [Docker Desktop](https://www.docker.com/products/docker-desktop) installed. If
you're using Windows, Docker Desktop works with [WSL](https://docs.microsoft.com/en-us/windows/wsl/about)
out of the box.

2. You'll need NodeJS and npm.

3. Make sure you have a filled-in `makerspace/server/.env` file. See below for more details. You can copy the contents of `.env.example` for a starting point.

## Setting Up SAML2 auth

You will need to generate a certificate (cert) and a private key for the Service Provider (us) and you
will also need a cert from your SAML Identity Provider (IdP).

1. First, generate an SSL key pair, using [OpenSSL](https://www.openssl.org), for example.\
\
Use `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900` to generate cert and private key.
Save these two files to the /server/cert directory and name them `cert.pem` and `key.pem`

2. If you need a metadata file to register with your IdP, run the server according to the instructions in [Running Locally](#running-locally) and retreive the file from the server at /Shibboleth.sso/Metadata. We recommend [SAMLTEST](https://samltest.id) as a test IdP.

3. If you have the metadata for the Identity Provider the cert should be listed under the `ds:X509Certificate` tag.
Copy the tag's contents into a file named `cert_idp.pem`

4. Finally add the callback url, entry point, and issuer fields to your .env file

The callback url is the url the Identity Provider redirects back to after attempting authentication

The entry point is the url on the Identity Provider that the Service Provider redirects the user to to start auth

The issuer (also sometimes refered to as a domain or entityID) is an identifier for the Service Provider, usually just the url to the metadata file.

If running locally, `CALLBACK_URL` will be `https://localhost:3000/login/callback`

If using SAMLTEST, `ENTRY_POINT` will be `https://samltest.id/idp/profile/SAML2/Redirect/SSO`



## Running Locally

First, build the containers: `docker-compose build`

Then, you have two options:
1. Run both the PostgreSQL database and Apollo server in Docker
2. Run PostgreSQL in Docker, and Apollo locally, outside of a container

### Option 1 — Running Both in Docker

> _⚠ We currently have an issue where the `server` container is unable to
connect to the `db` server. For now, this approach isn't recommended._

1. `docker-compose up -d` — Start both containers and run the migrations.
2. All done!

> _ℹ The `-d` flag stands for "detached." Without it, your terminal will follow the output
of the containers._

### Option 2 — Running Only `db` in Docker

1. `docker-compose up -d db` — Start _only_ the `db` container
2. `npm run build` — Build the Apollo layer
3. `npm run knex:migrate:latest` — Run the migrations
4. `npm run start:dev` — Run the Apollo server locally, outside of a container

## Connecting Directly to PostgreSQL

You can connect directly to PostgreSQL if needed. This is useful for running
your own queries, checking the tables, etc.

1. Open the CLI for the `db` container. This is easiest to do via Docker Desktop, just click
the `db` container, then click the CLI button in the top right. It has a `>_` icon.

2. `psql -U your_username your_db_name` — Connect to PostgresQL

3. Enter your commands. For example, `\dt` will list all tables. See [this guide](https://www.postgresqltutorial.com/postgresql-cheat-sheet/)
for more ideas.

## Running tests

- Test with jest: tests will use a separate db container, build with `docker-compose build` and start with `docker-compose up -d testdb`, then run tests with `npm run test`

- Test with output: `npm run test:watch`

## Database Migrations

- Add a new migration `npm run knex:migrate:make -- some-migration-name`

- Run migrations `npm run knex:migrate:latest`

- Rollback migration `npm run knex:migrate:rollback`
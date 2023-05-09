## Prerequisites

1. You'll need [Docker Desktop](https://www.docker.com/products/docker-desktop) installed. If
you're using Windows, Docker Desktop works with [WSL](https://docs.microsoft.com/en-us/windows/wsl/about)
out of the box.

2. Make sure you have a filled-in `makerspace/server/.env` file. You can copy the contents of `.env.example` for a starting point.

## Running Locally

1. `docker-compose build db` — build _only_ the `db` container
2. `docker-compose up -d db` — Start _only_ the `db` container
3. `npm run build` — Build the Apollo layer
4. `npm run knex:migrate:latest` — Run the migrations
5. `npm run start:dev` — Run the Apollo server locally, outside of a container

## Connecting Directly to PostgresQL

You can connect directly to PostgreSQL if needed. This is useful for running
your own queries, checking the tables, etc.

1. Open the CLI for the `db` container. This is easiest to do via Docker Desktop, just click
the `db` container, then click the CLI button in the top right. It has a `>_` icon.

2. `psql -U your_username your_db_name` — Connect to PostgresQL

3. Enter your commands. For example, `\dt` will list all tables. See [this guide](https://www.postgresqltutorial.com/postgresql-cheat-sheet/)
for more ideas.

## Setting Up SAML auth

This section describes how to configure the app to use SAML authentication rather than local mockup authentication.

You will need to generate a cert and a private key for the Service Provider (us) and you
will also need the cert from the Identity Provider.

1. First, generate an SSL key pair, using [OpenSSL](https://www.openssl.org), for example. Use this command to generate cert and private key.
    ```
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900
    ```
    Copy the public key into an environment variable in the server called `SSL_PUBKEY` and copy the private key into `SSL_PVKEY`. Node dotenv will recognize multiline variables as long as they are wrapped in double quotes.

2. If you need a metadata file to register with your IdP, run the server according to the instructions in [Running Locally](#running-locally) and retreive the file from the server at /Shibboleth.sso/Metadata. We recommend [SAMLTEST](https://samltest.id) as a test IdP.

3. If you have the metadata for the Identity Provider the cert should be listed under the `ds:X509Certificate` tag.
Copy the tag's contents into an environment variable called `IDP_PUBKEY`. Node dotenv will recognize multiline variables as long as they are wrapped in double quotes.

4. Finally add the entry point, callback url, and issuer fields to your .env file

    `ENTRY_POINT` is the url on the Identity Provider wher the Service Provider redirects the user to start auth

    `CALLBACK_URL` is the url the Identity Provider redirects back to after attempting authentication

    `ISSUER` (also sometimes refered to as a domain or entityID) is an identifier for the Service Provider, usually just the url to the metadata file. If you are registering this with an identity provider, you should use a unique value.

5. To start the server with hot reload using SAML authentication, use the command
    ```
    npm run start:staging
    ```

If running locally, `CALLBACK_URL` will be `https://localhost:3000/login/callback`

If using SAMLTEST, `ENTRY_POINT` will be `https://samltest.id/idp/profile/SAML2/Redirect/SSO`


## Building and Running the Server

- Run in development `npm run start:dev`

- Transpile your code and put it in the /dist folder `npm run build`

- Run the Transpiled code `npm run start`

- Test and watch `npm run test.watch`

## Database Stuff

- Add a new migration `npm run knex:migrate:make -- some-migration-name`

- Run migrations `npm run knex:migrate:latest`

- Rollback migration `npm run knex:migrate:rollback`

## Containerizing

- Build containers `docker-compose build`

- Run containers `docker-compose up -d`

- Run only the db container `docker-compose up -d db`

- Stop containers `docker-compose down`

## Src Folder Structure

- data: static data

- db: for knex migrations and config

- mappers: classes that convert from db to class objects

- models: classes that represent the domain objects, nested into folders by sub-domain

- repositories: classes that know how to get/upload domain objects, nested into folders by sub-domain

- resolvers: graphql resolvers 

- schemas: graphql schemas

- service: service classes, also nested by sub-domain

- test: tests

- views: static views
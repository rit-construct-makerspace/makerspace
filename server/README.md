## Our Two Docker Containers

We're using [Docker containers](https://www.docker.com/resources/what-container) to ensure
consistent development and deployment environments across the board, regardless of the
operating system, installed software, etc.

`db` — This container runs our [PostgreSQL database](https://www.postgresql.org/about/).

`server` — This container runs our [Apollo GraphQL server](https://www.apollographql.com/docs/apollo-server/).
This is where the business logic for the backend happens. It also exposes a GraphQL API
endpoint for our frontend to call.

## Prerequisites

1. You'll need [Docker Desktop](https://www.docker.com/products/docker-desktop) installed. If
you're using Windows, Docker Desktop works with [WSL](https://docs.microsoft.com/en-us/windows/wsl/about)
out of the box.

2. Make sure you have a filled-in `makerspace/server/.env` file. You can copy the contents of `.env.example` for a starting point.

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

## Connecting Directly to PostgresQL

You can connect directly to PostgresQL if needed. This is useful for running
your own queries, checking the tables, etc.

1. Open the CLI for the `db` container. This is easiest to do via Docker Desktop, just click
the `db` container, then click the CLI button in the top right. It has a `>_` icon.

2. `psql -U your_username your_db_name` — Connect to PostgresQL

3. Enter your commands. For example, `\dt` will list all tables. See [this guide](https://www.postgresqltutorial.com/postgresql-cheat-sheet/)
for more ideas.

## Setting Up SAML auth

You will need to generate a cert and a privite key for the Service Provider (us) and you
will also need the cert from the Identity Provider.

Use `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900` to generate cert and private key.
Save these two files to the cert directory under server and name them `cert.pem` and `key.pem`

If you have the metadata for the Identity Provider the cert should be listed under the `ds:X509Certificate` tag.
Copy the tag's contents into a file named `cert_idp.pem`

Finally add the callback url, entry point, and issuer fields to your .env file

The callback url is the url the Identity Provider redirects back to after attempting authentication
The entry point is the url on the Identity Provider that the Service Provider redirects the user to to start auth
The issuer (also sometimes refered to as a domain or entityID) is an identifier for the Service Provider, usually just the url to the metadata file


---
---
---

## Old Readme Contents Below

### Building and Running the Server

- Run in development `npm run start:dev`

- Transpile your code and put it in the /dist folder `npm run build`

- Run the Transpiled code `npm run start`

- Test with jest: tests will use a seperate db container, build with `docker-compose build` and start with `docker-compose up -d testdb`, then run tests with `npm run test`

- Test and watch `npm run test.watch`

### Database Stuff

- Add a new migration `npm run knex:migrate:make -- some-migration-name`

- Run migrations `npm run knex:migrate:latest`

- Rollback migration `npm run knex:migrate:rollback`

### Containerizing

- Build containers `docker-compose build`

- Run containers `docker-compose up -d`

- Run only the db container `docker-compose up -d db`

- Stop containers `docker-compose down`

### Src Folder Structure

- db: for knex migrations and config

- mappers: classes that convert from db to class objects

- models: classes that represent the domain objects, nested into folders by sub-domain

- repositories: classes that know how to get/upload domain objects, nested into folders by sub-domain

- resolvers: graphql resolvers 

- schemas: graphql schemas

- service: service classes, also nested by sub-domain

- test: tests

### Env Variables

- create a copy of .env.example named .env and add your values, both docker and node can utilize these

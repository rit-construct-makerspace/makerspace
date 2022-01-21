### Building and Running the Server

- Run in development `npm run start:dev`

- Transpile your code and put it in the /dist folder `npm run build`

- Run the Transpiled code `npm run start`

- Test with jest `npm run test`

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

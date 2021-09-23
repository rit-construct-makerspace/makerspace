### Building and Running the Server

- Run in development `npm run start:dev`

- Transpile your code and put it in the /dist folder `npm run build`

- Run the Transpiled code `npm run start`

- Test with jest `npm run test`

- Test and watch `npm run test.watch`

- Add a new migration `npm run knex:migrate:make -- some-migration-name`

- Run migrations `npm run knex:migrate:latest`

- Rollback migration `npm run knex:migrate:rollback`

Initial code structure and setup heavily influenced by:

 https://mbbaig.blog/apollo-server-typescript/

 https://javascript.plainenglish.io/writing-a-node-js-graphql-backend-that-actually-scales-a-complete-guide-part-1-setup-cddceae25bdc
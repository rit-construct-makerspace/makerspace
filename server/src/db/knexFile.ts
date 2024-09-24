import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname;

require("dotenv").config({ path: __dirname + "/./../../.env" });

// Update with your config settings.
const config: any = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function(connection: any, callback: any) {
        console.log("timezoning")
        connection.query('SET TIME ZONE TO \'EST5EDT\';', function(err: Error) {
          console.log(err)
          callback(err, connection);
        });
      }
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "migrations",
    },
    asyncStackTraces: true,
  },

  staging: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
        sslmode: 'require',
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "migrations",
    },
    asyncStackTraces: true,
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
        sslmode: 'require',
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "migrations",
    },
  },

  test: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "dist/db/migrations",
    },
    seeds: {
      directory: "seeds",
    },
  },
};

export default config;
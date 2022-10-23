require("dotenv").config({ path: __dirname + "/./../../.env" });

// Update with your config settings.
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "migrations",
    },
    asyncStackTraces: true
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.POSTGRES_ENDPOINT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
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
      host: "localhost",
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5433,
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

require("dotenv").config({ path: __dirname + "/./../../.env" });

// Update with your config settings.
module.exports = {
  development: {
    client: "pg",
    connection: {
      hconnectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
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
      hconnectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
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
      hconnectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
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

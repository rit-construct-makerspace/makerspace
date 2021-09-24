// Update with your config settings.
module.exports = {

  development: {
    client: "pg",
    connection: {
      host: "172.22.0.1",
      user: "postgres",
      database: "test",
      password: "password",
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

  production: {
    client: "pg",
    connection: {
      host: "172.22.0.1",
      user: "postgres",
      database: "test",
      password: "password",
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
  }

};
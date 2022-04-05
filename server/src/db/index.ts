import { knex } from "knex";

const connection =
  require("../db/knexFile")[process.env.NODE_ENV || "development"];

const knexInstance = knex(connection);

export { knexInstance as knex };

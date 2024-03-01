require("dotenv").config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: "pg",
    useNullAsDefault: true,
    connection: process.env.POSTGRES_URL,
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  production: {
    client: "pg",
    useNullAsDefault: true,
    connection: process.env.POSTGRES_URL,
  },
}

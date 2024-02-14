/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./be/dev.sqlite3",
    },
    migrations: {
      directory: "./be/migrations",
    },
    seeds: {
      directory: "./be/seeds",
    },
  },
}

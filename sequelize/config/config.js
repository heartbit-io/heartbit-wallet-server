/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  development: {
    username: "tvp",
    password: "password",
    database: "forum",
    host: "localhost",
    dialect: "postgres",
  },
  test: {
     username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER,
  }
}

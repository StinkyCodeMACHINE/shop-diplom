const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  process.env.DB_NAME, // название БД
  process.env.DB_USER, // имя пользователя
  process.env.DB_PASSWORD, // пароль
  {
    host: process.env.DB_HOST, // д
    dialect: "postgres",
    port: process.env.DB_PORT,
  }
);



// DB_NAME = online_store;
// DB_USER = postgres;
// DB_PASSWORD = 1;
// DB_HOST = localhost;
// DB_PORT = 5432;

const { Sequelize } = require("sequelize");

// Database connection
const sequelize = new Sequelize("telemedicine_db", "root", "MERviccity2022@@", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

module.exports = sequelize;

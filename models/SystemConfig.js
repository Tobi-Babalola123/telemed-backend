const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SystemConfig = sequelize.define("SystemConfig", {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = SystemConfig;

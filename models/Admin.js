// models/Admin.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Admin extends Model {}

Admin.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
  },
  {
    sequelize,
    modelName: "Admin",
  }
);

module.exports = Admin;

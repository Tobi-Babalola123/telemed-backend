const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Doctor extends Model {}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // availability: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    // },
    // licenseNumber: {
    //   type: DataTypes.STRING, // Added for doctor identification
    //   allowNull: true,
    // },
  },
  {
    sequelize,
    modelName: "Doctor",
    tableName: "doctors",
  }
);

module.exports = Doctor;

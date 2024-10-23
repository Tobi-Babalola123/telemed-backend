const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Appointment extends Model {}

Appointment.init(
  {
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "doctors",
        key: "id",
      },
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    appointment_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "scheduled",
    },
    notes: {
      type: DataTypes.TEXT, // Added for additional appointment notes
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
  }
);

module.exports = Appointment;

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure the doctors and admins tables are only dropped if they exist
    await queryInterface.dropTable("doctors").catch((error) => {
      if (error.message !== "Cannot drop table, because it does not exist.") {
        throw error;
      }
    });
    await queryInterface.dropTable("admins").catch((error) => {
      if (error.message !== "Cannot drop table, because it does not exist.") {
        throw error;
      }
    });

    // Create the users table, adding the ifNotExists option
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        role: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
      },
      { ifNotExists: true }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the users table
    await queryInterface.dropTable("users");

    await queryInterface.createTable(
      "admins",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
      },
      { ifNotExists: true }
    );

    await queryInterface.createTable(
      "doctors",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        specialty: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
      },
      { ifNotExists: true }
    );

    // Recreate foreign key constraints if necessary
    await queryInterface.addConstraint("doctor_schedules", {
      fields: ["doctorId"],
      type: "foreign key",
      name: "doctor_schedules_ibfk_1",
      references: {
        table: "doctors",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
};

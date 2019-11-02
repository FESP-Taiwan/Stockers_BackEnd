const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const { sequelize } = require("../connection");
const Modules = require("./Modules");

let User = sequelize.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    authId: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);
module.exports = { User };

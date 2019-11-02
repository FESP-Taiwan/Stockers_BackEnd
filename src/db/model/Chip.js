const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const { sequelize } = require("../connection");

let Chips = sequelize.define(
  "chip",
  {
    parentName: Sequelize.STRING,
    chipName: Sequelize.STRING
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);

module.exports = { Chips };

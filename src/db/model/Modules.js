const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const { sequelize } = require("../connection");

let Modules = sequelize.define(
  "module",
  {
    name: Sequelize.STRING,
    subName: Sequelize.STRING,
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    comment: Sequelize.JSON,
    usingStock: Sequelize.JSON,
    mathModule: Sequelize.JSON
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);

module.exports = { Modules };

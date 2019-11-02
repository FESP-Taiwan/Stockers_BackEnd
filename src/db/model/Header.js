const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const { sequelize } = require("../connection");

let Header = sequelize.define(
  "header",
  {
    headerName: Sequelize.STRING,
    parentName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    moduleId: Sequelize.INTEGER,
    columnId: Sequelize.INTEGER,
    chipId: Sequelize.INTEGER
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);

module.exports = { Header };
``;

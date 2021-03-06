const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const { sequelize } = require("../connection");

let Stocks = sequelize.define(
  "stock",
  {
    companyName: Sequelize.STRING,
    companyNumber: Sequelize.INTEGER,
    calculatedValue: Sequelize.FLOAT,
    alertion: Sequelize.STRING,
    rate: Sequelize.FLOAT,
    userId: Sequelize.INTEGER
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);
module.exports = { Stocks };

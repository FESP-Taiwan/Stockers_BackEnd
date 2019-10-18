const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const sequelize = new Sequelize(database, username, password, {
  ...config.get("mysqlCon")
});

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

Chips.sync().then(() => {
  console.log("Chips table created");
});

module.exports = { Chips };

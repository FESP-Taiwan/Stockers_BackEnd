const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const sequelize = new Sequelize(database, username, password, {
  ...config.get("mysqlCon")
});

let Header = sequelize.define(
  "header",
  {
    headerName: Sequelize.STRING,
    moduleId: Sequelize.INTEGER
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);

Header.sync().then(() => {
  console.log("Header table created");
});

module.exports = { Header };

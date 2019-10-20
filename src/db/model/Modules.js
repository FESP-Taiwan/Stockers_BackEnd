const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const sequelize = new Sequelize(database, username, password, {
  ...config.get("mysqlCon")
});

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
    usingStock: Sequelize.ARRAY
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);

Modules.sync().then(() => {
  console.log("Modules table created");
});
// sync 相當於把model跟db同步

module.exports = { Modules };

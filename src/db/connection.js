const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const sequelize = new Sequelize(database, username, password, {
  ...config.get("mysqlCon")
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
module.exports = { sequelize };

const Sequelize = require("sequelize");
const config = require("config");
const { database, username, password } = config.get("mysql");
const sequelize = new Sequelize(database, username, password, {
  ...config.get("mysqlCon")
});
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

User.sync().then(() => {
  console.log("user table created");
});

module.exports = { User };

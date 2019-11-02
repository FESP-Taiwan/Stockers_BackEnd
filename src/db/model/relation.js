const { sequelize } = require("../connection");
const { User } = require("./User");
const { Chips } = require("./Chip");
const { Stocks } = require("./Stocks");
const { Modules } = require("./Modules");
const { Header } = require("./Header");

const createTable = async () => {
  User.hasMany(Stocks, { foreignKey: "userId" });
  User.hasMany(Modules, { foreignKey: "userId" });
  Modules.hasMany(Header, { foreignKey: "moduleId" });
  Header.belongsTo(Chips, { foreignKey: "chipId" });

  await sequelize.sync();
  console.log("relation configure");
  return "createTable";
};

module.exports = createTable;

const { User } = require("./User");
const { Stocks } = require("./Stocks");
const { Modules } = require("./Modules");
const { Header } = require("./Header");
const { Chips } = require("./Chip");

User.hasMany(Modules, { foreignKey: "userId" });
User.hasMany(Stocks, { foreignKey: "userId" });
Header.belongsTo(Chips, { foreignKey: "chipId" });
Modules.hasMany(Header, { foreignKey: "moduleId" });

console.log("relation configure");

const { Stocks } = require("./Stocks");
const { Modules } = require("./Modules");
const { User } = require("./User");
const { Header } = require("./Header");
const { Chips } = require("./Chip");

User.hasMany(Modules, { foreignKey: "userId" });
User.hasMany(Stocks, { foreignKey: "userId" });
Modules.hasMany(Header, { foreignKey: "moduleId" });
Chips.belongsTo(Header, { foreignKey: "chipId" });

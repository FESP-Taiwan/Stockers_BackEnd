const { Stocks } = require("./Stocks");
const { Modules } = require("./Modules");
const { User } = require("./User");
const { Header } = require("./Header");

User.hasMany(Modules, { foreignKey: "userId" });
Modules.hasMany(Stocks, { foreignKey: "moduleId" });
Modules.hasMany(Header, { foreignKey: "moduleId" });

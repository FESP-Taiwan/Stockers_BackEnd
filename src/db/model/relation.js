const { Chips } = require('./Chip');
const { Stocks } = require('./Stocks');
const { Modules } = require('./Modules');
const { User} = require('./User');

User.hasMany(Modules,{foreignKey:'userId'});
Modules.hasMany(Stocks,{foreignKey:'moduleId'});
Modules.hasMany(Chips,{foreignKey:'moduleId'});


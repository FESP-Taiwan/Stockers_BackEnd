const Sequelize = require('sequelize');

const path = 'mysql://root:root@localhost:3306/fesp_backend';
const sequelize = new Sequelize(path);

let User = sequelize.define('user',{
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING
})

User.sync().then(() => {
    console.log('new table created')
})
// sync 相當於把model跟db同步

module.exports = User;
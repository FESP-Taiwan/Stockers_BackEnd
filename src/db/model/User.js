const Sequelize = require('sequelize');
const config =require('config')
const {database,username,password}=config.get('mysql');
const sequelize = new Sequelize( database,username,password,{...config.get('mysqlCon')});

let User = sequelize.define('user',{
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING
},{
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  })


let OauthUser = sequelize.define('Oauthuser',{
   userId: {
      type: Sequelize.STRING,
      primaryKey: true
   },
   name: Sequelize.STRING
},{
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  })

  
User.sync().then(() => {
    console.log('user table created');
})

OauthUser.sync().then(() => {
    console.log('oauth user table created');
})
// sync 相當於把model跟db同步

module.exports = {User, OauthUser};
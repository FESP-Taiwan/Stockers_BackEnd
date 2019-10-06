const Sequelize = require('sequelize');
const config =require('config')
const {database,username,password}=config.get('mysql');
const sequelize = new Sequelize( database,username,password,{...config.get('mysqlCon')});

let Chips = sequelize.define('chip',{
	chipName: Sequelize.STRING,
	moduleId: Sequelize.INTEGER
},{
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  })

Chips.sync().then(() => {
    console.log('Chips table created');
})


module.exports = {Chips};
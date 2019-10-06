const Sequelize = require('sequelize');
const config =require('config')
const {database,username,password}=config.get('mysql');
const sequelize = new Sequelize( database,username,password,{...config.get('mysqlCon')});

let Stocks = sequelize.define('module',{
	companyName: Sequelize.STRING,
	companyNumber: Sequelize.INTEGER, 
	calculatedValue: Sequelize.FLOAT, 
	alertion: Sequelize.STRING,
	rate: Sequelize.FLOAT,
	moduleId: Sequelize.INTEGER
},{
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  })

Stocks.sync().then(() => {
    console.log('Stocks table created');
})


module.exports = {Stocks};
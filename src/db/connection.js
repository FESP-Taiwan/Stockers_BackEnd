const Sequelize = require('sequelize');

const path = 'mysql://root:root@mysql;password:root/fesp_backend';
const sequelize = new Sequelize(path)

sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  }).finally(() => {
    sequelize.close();
  });
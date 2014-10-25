var Sequelize = require('sequelize');
var sequelize = new Sequelize('', '', '', {
    dialect: 'sqlite',
    storage: './sequelize-test.sqlite'
});

module.exports = sequelize;
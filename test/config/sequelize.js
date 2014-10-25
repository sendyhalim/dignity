var Sequelize = require('sequelize');
var sequelize = new Sequelize('', '', '', {
    dialect: 'sqlite',
    storage: './sequelize-test.sqlite',
    define: {
      // disable sync on association, for sequelize ^1.0.0
      syncOnAssociation: false
    },
    logging: false
});

module.exports = sequelize;
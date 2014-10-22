var bookshelf = require('../../config/bookshelf');

var Permission = bookshelf.Model.extend({
  tableName: 'permissions',
  roles: function () {
    return this.belongsToMany(require('./Role'), 'roles_permissions');
  }
});

module.exports = Permission;
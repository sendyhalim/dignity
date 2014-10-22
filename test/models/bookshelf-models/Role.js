var bookshelf = require('../../config/bookshelf');
var PermissionModel = './Permission';

var Role = bookshelf.Model.extend({
  tableName: 'roles',
  permissions: function () {
    return this.belongsToMany(require(PermissionModel), 'roles_permissions');
  }
});

module.exports = Role;
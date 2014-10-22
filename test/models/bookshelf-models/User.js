var bookshelf = require('../../config/bookshelf');
var RoleModel = './Role';

var User = bookshelf.Model.extend({
  tableName: 'users',
  roles: function () {
    return this.belongsToMany(require(RoleModel), 'users_roles');
  }
});

module.exports = User;
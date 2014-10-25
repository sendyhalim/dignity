var sequelize = require('../../config/sequelize');
var Sequelize = require('sequelize');

var Role = sequelize.define('roles', {
  id: Sequelize.INTEGER,
  name: Sequelize.STRING
}, {
  tableName: 'roles',
  timestamps: false,
  classMethods: {
    getPermissionModel: function () {
      return Permission
    }
  }
});


var User = sequelize.define('users', {
  id: Sequelize.INTEGER,
  name: Sequelize.STRING
}, {
  tableName: 'users',
  timestamps: false,
  classMethods: {
    getRoleModel: function () {
      return Role
    }
  }
});

var Permission = sequelize.define('permissions', {
  id: Sequelize.INTEGER,
  name: Sequelize.STRING,
  display_name: Sequelize.STRING
}, {
  tableName: 'permissions',
  timestamps: false
});

var UsersRoles = sequelize.define('users_roles', {
  id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
  role_id: Sequelize.INTEGER
}, {
  tableName: 'users_roles',
  timestamps: false
});

var RolesPermissions = sequelize.define('roles_permissions', {
  id: Sequelize.INTEGER,
  role_id: Sequelize.INTEGER,
  permission_id: Sequelize.INTEGER
}, {
  tableName: 'roles_permissions',
  timestamps: false
});

User.hasMany(Role, {
  through: UsersRoles,
  foreignKey: 'user_id'
});

Role.hasMany(User, {
  through: UsersRoles,
  foreignKey: 'role_id'
});

Role.hasMany(Permission, {
  through: RolesPermissions,
  foreignKey: 'role_id'
});

Permission.hasMany(Role, {
  through: RolesPermissions,
  foreignKey: 'permission_id'
});

module.exports = {
  User: User,
  Role: Role,
  Permission: Permission,
  sync: function () {
    return sequelize.sync();
  }
};
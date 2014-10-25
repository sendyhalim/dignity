var _ = require('lodash');
var util = require('util');
var BaseLayer = require('./base-layer');

/**
 * A dignity layer for sequelize orm
 * @param {Object} user Should be sequelize model instance
 */
var SequelizeLayer = function SequelizeLayer (user) {
  BaseLayer.call(this, user);
};

// extend the BaseLayer prototype
util.inherits(SequelizeLayer, BaseLayer);

/**
 * Analyze dignity(roles and permissions)
 * @return {Promise}
 */
SequelizeLayer.prototype.analyzeDignity = function () {
  var self = this;

  if (typeof this.user.Model.getRoleModel !== 'function') {
    console.error('Please define User.getRoleModel()');
    return;
  }
  var Role = this.user.Model.getRoleModel();

  if (typeof Role.getPermissionModel !== 'function') {
    console.error('Please define Role.getPermissionModel()');
    return;
  }
  var Permission = Role.getPermissionModel();

  // for sequelize just re-find the user based on his/her id
  return this.user.Model.find({
    where: {
      id: this.user.id
    },
    include:  [{
      model: Role,
      as: 'roles',
      include: [{
        model: Permission,
        as: 'permissions'
      }]
    }]
  })
  .then(function (result) {
    self.user = result;
    self.roles = result.roles;

    // extract permissions
    _.forEach(self.roles, function (r) {
      _.forEach(r.permissions, function (p) {
        var doesNotExist = !~_.findIndex(self.permissions, function (perm) {
          return perm.name.toLowerCase() == p.name.toLowerCase()
        });

        if (doesNotExist) {
          self.permissions.push(p);
        }
      });
    });

    // pass it as result to next then() chain
    return self;
  });
};

module.exports = SequelizeLayer;
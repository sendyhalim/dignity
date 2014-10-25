var _ = require('lodash');
var BaseLayer = function BaseLayer (user) {
  this.permissions = [];
  this.roles = [];
  this.user = user;
};

BaseLayer.prototype.getUser = function () {
  return this.user;
};

BaseLayer.prototype.setUser = function (user) {
  this.user = user;

  return this.analyzeDignity();
};

BaseLayer.prototype.getPermissions = function () {
  return this.permissions;
};

BaseLayer.prototype.getRoles = function () {
  return this.roles;
};

BaseLayer.prototype.can = function () {
  return this.check('permissions', arguments);
};

BaseLayer.prototype.is = function () {
  return this.check('roles', arguments);
};

BaseLayer.prototype.check = function (key, params) {
  var dignityValues = this[key];
  var found = false;

  args = params[0] instanceof Array ? params[0] : Array.prototype.slice.call(params, 0);

  _.forEach(args, function (val) {
    // if we haven't found it then keep searching
    if (found !== true) {
      // check if the supplied arguments is in user's dignity values
      found = !!~_.findIndex(dignityValues, function (dignity) {
        return dignity.name.toLowerCase() == val.toLowerCase();
      });
    }
  });

  return found;
};

BaseLayer.prototype.hasPermission = BaseLayer.prototype.can;
BaseLayer.prototype.hasRole = BaseLayer.prototype.is;

module.exports = BaseLayer;
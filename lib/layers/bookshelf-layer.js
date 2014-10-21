var _ = require('lodash');

var BookshelfLayer = function BookshelfLayer (user) {
  this.setUser(user);
};

BookshelfLayer.prototype.loadRelationships = function () {
  var self = this;

  return this.user.load([
    'permissions',
    'roles'
  ])
  .then(function (user) {
    self.user = user;
    self.permissions = user.permissions;
    self.roles = user.roles;
  });
};

BookshelfLayer.prototype.getUser = function () {
  return this.user;
};

BookshelfLayer.prototype.setUser = function (user) {
  this.user = user;

  return this.loadRelationships();
};

BookshelfLayer.prototype.getPermissions = function () {
  return this.user.permissions;
};

BookshelfLayer.prototype.getRoles = function () {
  return this.user.roles;
};

BookshelfLayer.prototype.can = function () {
  return this.check('permissions', arguments);
};

BookshelfLayer.prototype.is = function () {
  return this.check('roles', arguments);
};

BookshelfLayer.prototype.check = function (key, params) {
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

BookshelfLayer.prototype.hasPermission = BookshelfLayer.prototype.can;
BookshelfLayer.prototype.hasRole = BookshelfLayer.prototype.is;

module.exports = BookshelfLayer;
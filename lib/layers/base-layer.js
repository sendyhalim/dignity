var _ = require('lodash');

/**
 * A BaseLayer to be extended for various dignity layer
 * @param {Object} user The user object to be analyzed, should be an orm instance
 */
var BaseLayer = function BaseLayer (user) {
  this.permissions = [];
  this.roles = [];
  this.user = user;
};

/**
 * return the set user
 * @return {Object}
 */
BaseLayer.prototype.getUser = function () {
  return this.user;
};

/**
 * Set new user to layer then it will automatically analyzeDignity again
 * @param {Object} user
 * @return {Promise}
 */
BaseLayer.prototype.setUser = function (user) {
  this.user = user;

  // re-analyze user data when new user is set
  return this.analyzeDignity();
};

/**
 * @return {Array}
 */
BaseLayer.prototype.getPermissions = function () {
  return this.permissions;
};

/**
 * @return {Array}
 */
BaseLayer.prototype.getRoles = function () {
  return this.roles;
};

/**
 * Check if user has the permission(s)
 * @param {Array|String}
 * @return {Boolean}
 */
BaseLayer.prototype.can = function () {
  return this.check('permissions', arguments);
};

/**
 * Check if user has the given role(s)
 * @param {Array|String}
 * @return {Boolean}
 */
BaseLayer.prototype.is = function () {
  return this.check('roles', arguments);
};

BaseLayer.prototype.check = function (key, params) {
  var dignityValues = this[key];
  var found = false;

  args = params[0] instanceof Array ? params[0] : Array.prototype.slice.call(params, 0);

  _.forEach(args, function (val) {
    // if we haven't found it then keep searching..
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
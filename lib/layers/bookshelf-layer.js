var _ = require('lodash');
var util = require('util');
var BaseLayer = require('./base-layer');

var BookshelfLayer = function BookshelfLayer (user) {
  BaseLayer.call(this, user);
};

util.inherits(BookshelfLayer, BaseLayer);

BookshelfLayer.prototype.analyzeDignity = function () {
  var self = this;

  return this.user.load([
    'roles.permissions'
  ])
  .then(function (result) {
    self.user = result;
    self.roles = result.toJSON().roles;

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


module.exports = BookshelfLayer;
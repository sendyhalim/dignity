var expect = require('chai').expect;
var sinon = require('sinon');
var BookshelfLayer = require('../../lib/layers/bookshelf-layer');
var userDummy = require('../dummy/user');
var rolesDummy = require('../dummy/roles');
var permissionsDummy = require('../dummy/permissions');

userDummy.toJSON = function () {
  return this;
};

describe('Bookshelf Layer', function () {
  var layer = undefined;
  var user = {
    load: function (){}
  };

  before(function (done) {
    sinon.stub(user, 'load').returns({
      then: function (callback){
        callback(userDummy);
      }
    });

    done();
  });

  beforeEach(function (done) {
    layer = new BookshelfLayer(user);
    layer.analyzeDignity();
    done();
  });

  it('should have permissions as an array', function () {
    expect(layer.getPermissions()).to.be.an('array');
  });

  it('should have roles as an array', function () {
    expect(layer.getRoles()).to.be.an('array');
  });

  it('should check user roles', function () {
    expect(layer.is(rolesDummy)).to.equal(true);
    expect(layer.hasRole(rolesDummy)).to.equal(true);
    expect(layer.is('nobody')).to.equal(false);
    expect(layer.hasRole('nobody')).to.equal(false);
  });

  it('should check user permissions', function () {
    expect(layer.can(permissionsDummy)).to.equal(true);
    expect(layer.hasPermission(permissionsDummy)).to.equal(true);
    expect(layer.can('sing-all-day-long')).to.equal(false);
    expect(layer.hasPermission('sing-all-day-long')).to.equal(false);

    expect(layer.getPermissions().length).to.equal(3);
  });
});
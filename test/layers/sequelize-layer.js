var expect = require('chai').expect;
var sinon = require('sinon');
var SequelizeLayer = require('../../').SequelizeLayer;
var rolesDummy = require('../dummy/roles');
var permissionsDummy = require('../dummy/permissions');
var models = require('../models');
var fs = require('fs');

describe('Sequelize Layer', function () {
  this.timeout(15000);
  var layer;
  var user;

  before(function (done) {
    var User = models.sequelize.User;
    models.prepareAllDummyData(models.sequelizeDatabase).then(function (r) {
      User.find(1).then(function (result) {
        user = result;
        done();
      });
    });
  });

  after(function (done) {
    fs.unlinkSync(models.sequelizeDatabase);
    done();
  });

  // create new layer and analyze user's roles and permissions for each test
  beforeEach(function (done) {
    layer = new SequelizeLayer(user);
    layer.analyzeDignity().then(function (newLayer) {
      done();
    });
  });

  it('should have permissions as an array', function (done) {
    expect(layer.getPermissions()).to.be.an('array');
    done()
  });

  it('should have roles as an array', function (done) {
    expect(layer.getRoles()).to.be.an('array');
    done()
  });

  it('should check user roles', function (done) {
    expect(layer.is(rolesDummy)).to.equal(true);
    expect(layer.hasRole(rolesDummy)).to.equal(true);
    expect(layer.is('nobody')).to.equal(false);
    expect(layer.hasRole('nobody')).to.equal(false);
    done();
  });

  it('should check user permissions', function (done) {
    expect(layer.can(permissionsDummy)).to.equal(true);
    expect(layer.hasPermission(permissionsDummy)).to.equal(true);
    expect(layer.can('sing-all-day-long')).to.equal(false);
    expect(layer.hasPermission('sing-all-day-long')).to.equal(false);

    expect(layer.getPermissions().length).to.equal(3);
    done();
  });
});
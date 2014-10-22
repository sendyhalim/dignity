var expect = require('chai').expect;
var sinon = require('sinon');
var BookshelfLayer = require('../../lib/layers/bookshelf-layer');
var rolesDummy = require('../dummy/roles');
var permissionsDummy = require('../dummy/permissions');
var models = require('../models/bookshelf');

describe('Bookshelf Layer', function () {
  this.timeout(15000);
  var layer;
  var user;

  before(function (done) {
    models.insertData.then(function (r) {
      (new models.User({
        id: 1
      }))
      .fetch()
      .then(function (result) {
        user = result;
        done();
      });
    });
  });

  after(function (done) {
    var fs = require('fs');
    // delete sqlite file
    fs.unlinkSync(__dirname + '/../../bookshelfjs-test.sqlite');
    done()
  });

  // create new layer and analyze user's roles and permissions for each test
  beforeEach(function (done) {
    layer = new BookshelfLayer(user);
    layer.analyzeDignity().then(function (newLayer) {
      done();
    });
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
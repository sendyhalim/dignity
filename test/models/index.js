

// ----------------------------------------------------
// For inserting dummy data
// ----------------------------------------------------
var bookshelfModels = require('./bookshelf-models');
var sequelizeModels = require('./sequelize-models');
var User = bookshelfModels.User;
var Permission = bookshelfModels.Permission;
var Role = bookshelfModels.Role;
var Promise = require('bluebird');
var dummyUser;
var dummyRoles;
var dummyPermissions;

var prepareAllDummyData = function (dbName) {
  // create db based on given dbName
  var dbConfig = {
    client: 'sqlite3',
    connection: {
      filename: dbName
    }
  };

  var knex = require('knex')(dbConfig);

  var createTables = function () {
    var tables = [];

    tables.push(knex.schema.createTable('users', function (t) {
      t.increments();
      t.string('name');
    }));

    tables.push(knex.schema.createTable('roles', function (t) {
      t.increments();
      t.string('name');
    }));

    tables.push(knex.schema.createTable('permissions', function (t) {
      t.increments();
      t.string('name');
      t.string('display_name');
    }));

    tables.push(knex.schema.createTable('users_roles', function (t) {
      t.increments();
      t.integer('role_id').unsigned();
      t.integer('user_id').unsigned();
    }));

    tables.push(knex.schema.createTable('roles_permissions', function (t) {
      t.increments();
      t.integer('role_id').unsigned();
      t.integer('permission_id').unsigned();
    }));

    return Promise.all(tables);
  }; // end createTables()

  var insertModels = function () {
    var models = [];

    // ----------------------------------------------------
    // Creating Users
    // ----------------------------------------------------
    dummyUser = {
      id: 1,
      name: 'Monyet Sahur'
    };

    models.push(knex.insert(dummyUser).into('users'));


    // ----------------------------------------------------
    // Creating roles
    // ----------------------------------------------------
    dummyRoles = {
      ironman: {
        id: 1,
        name: 'ironman'
      },
      editor: {
        id: 2,
        name: 'editor'
      }
    };

    models.push(knex.insert(dummyRoles.ironman).into('roles'));
    models.push(knex.insert(dummyRoles.editor).into('roles'));

    // ----------------------------------------------------
    // Creating permissions
    // ----------------------------------------------------
    dummyPermissions = {
      playing: {
        id: 1,
        name: 'PlayIng',
        display_name: 'PlayIng'
      },
      googling: {
        id: 2,
        name: 'GoogLING',
        display_name: 'GoogLING'
      },
      watching: {
        id: 3,
        name: 'WatcHing',
        display_name: 'WatcHing'
      }
    };

    models.push(knex.insert(dummyPermissions.playing).into('permissions'));
    models.push(knex.insert(dummyPermissions.googling).into('permissions'));
    models.push(knex.insert(dummyPermissions.watching).into('permissions'));

    return Promise.all(models);
  };// end insertModels()

  var insertRolesAndPermissions = function () {
    var rolesAndPermissions = [];

    rolesAndPermissions.push(knex.insert([
      { id: 1, user_id: dummyUser.id, role_id: dummyRoles.ironman.id },
      { id: 2, user_id: dummyUser.id, role_id: dummyRoles.editor.id },
    ])
    .into('users_roles'));

    rolesAndPermissions.push(knex.insert([
      { id: 1, role_id: dummyRoles.editor.id, permission_id: dummyPermissions.googling.id},
      { id: 2, role_id: dummyRoles.editor.id, permission_id: dummyPermissions.watching.id},

      { id: 3, role_id: dummyRoles.ironman.id, permission_id: dummyPermissions.playing.id},
      { id: 4, role_id: dummyRoles.ironman.id, permission_id: dummyPermissions.watching.id},
    ]).into('roles_permissions'));

    return Promise.all(rolesAndPermissions);
  };// end insertRolesAndPermissions()

  return Promise.all([createTables(), insertModels(), insertRolesAndPermissions()]);
};

module.exports = {
  prepareAllDummyData: prepareAllDummyData,
  bookshelf: bookshelfModels,
  sequelize: sequelizeModels,
  bookshelfDatabase: './bookshelf-test.sqlite',
  sequelizeDatabase: './sequelize-test.sqlite'
}
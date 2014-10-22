var User = require('./User');
var Role = require('./Role');
var Permission = require('./Permission');
var bookshelf = require('../../config/bookshelf');

var Promise = require('bluebird');
var createTables = [];

createTables.push(bookshelf.knex.schema.createTable('users', function (t) {
  t.increments();
  t.string('name');
}));

createTables.push(bookshelf.knex.schema.createTable('roles', function (t) {
  t.increments();
  t.string('name');
}));

createTables.push(bookshelf.knex.schema.createTable('permissions', function (t) {
  t.increments();
  t.string('name');
  t.string('display_name');
}));

createTables.push(bookshelf.knex.schema.createTable('users_roles', function (t) {
  t.increments();
  t.integer('role_id').unsigned();
  t.integer('user_id').unsigned();
}));

createTables.push(bookshelf.knex.schema.createTable('roles_permissions', function (t) {
  t.increments();
  t.integer('role_id').unsigned();
  t.integer('permission_id').unsigned();
}));


var insertData = Promise.all(createTables)
.then(function () {
  var createModels = [];

  // ----------------------------------------------------
  // Creating Users
  // ----------------------------------------------------
  var user = {
    id: 1,
    name: 'Monyet Sahur'
  };

  createModels.push(bookshelf.knex.insert(user).into('users'));


  // ----------------------------------------------------
  // Creating roles
  // ----------------------------------------------------
  var roles = {
    ironman: {
      id: 1,
      name: 'ironman'
    },
    editor: {
      id: 2,
      name: 'editor'
    }
  };

  createModels.push(bookshelf.knex.insert(roles.ironman).into('roles'));
  createModels.push(bookshelf.knex.insert(roles.editor).into('roles'));

  // ----------------------------------------------------
  // Creating permissions
  // ----------------------------------------------------
  var permissions = {
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

  createModels.push(bookshelf.knex.insert(permissions.playing).into('permissions'));
  createModels.push(bookshelf.knex.insert(permissions.googling).into('permissions'));
  createModels.push(bookshelf.knex.insert(permissions.watching).into('permissions'));

  // ----------------------------------------------------
  // Attaching roles and permissions
  // ----------------------------------------------------
  return Promise.all(createModels).then(function () {

    var insertRelations = [];

    insertRelations.push(bookshelf.knex.insert([
      { id: 1, user_id: user.id, role_id: roles.ironman.id },
      { id: 2, user_id: user.id, role_id: roles.editor.id },
    ])
    .into('users_roles'));

    insertRelations.push(bookshelf.knex.insert([
      { id: 1, role_id: roles.editor.id, permission_id: permissions.googling.id},
      { id: 2, role_id: roles.editor.id, permission_id: permissions.watching.id},

      { id: 3, role_id: roles.ironman.id, permission_id: permissions.playing.id},
      { id: 4, role_id: roles.ironman.id, permission_id: permissions.watching.id},
    ]).into('roles_permissions'));

    return Promise.all(insertRelations);
  });
});

module.exports = {
  User: User,
  Role: Role,
  Permission: Permission,
  insertData: insertData,
  instance: bookshelf
};
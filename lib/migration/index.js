exports.up = function (knex, Promise) {
  var process = [
    knex.schema.createTable('roles', function (table) {
      table.increments();
      table.string('name').unique();
    }),

    knex.schema.createTable('permissions', function (table) {
      table.increments();
      table.string('name').unique();
      table.string('display_name');
    }),

    knex.schema.createTable('users_roles', function (table) {
      table.increments();

      // foreign key to users table
      table.integer('user_id')
           .unsigned()
           .references('id')
           .inTable('users')
           .onUpdate('cascade')
           .onDelete('cascade');

      // foreign key in roles table
      table.integer('role_id')
           .unsigned()
           .references('id')
           .inTable('roles')
           .onUpdate('cascade')
           .onDelete('cascade');
    }),

    knex.schema.createTable('roles_permissions', function (table) {
      table.increments();

      // foreign key to users table
      table.integer('role_id')
           .unsigned()
           .references('id')
           .inTable('roles')
           .onUpdate('cascade')
           .onDelete('cascade');

      // foreign key in roles table
      table.integer('permission_id')
           .unsigned()
           .references('id')
           .inTable('permissions')
           .onUpdate('cascade')
           .onDelete('cascade');
    })
  ];

  return Promise.all(process);
};

exports.down = function (knex, Promise) {
  var process = [
    knex.schema.dropTableIfExists('users_roles'),
    knex.schema.dropTableIfExists('roles_permissions'),
    knex.schema.dropTableIfExists('roles'),
    knex.schema.dropTableIfExists('permissions')
  ];

  return Promise.all(process);
};
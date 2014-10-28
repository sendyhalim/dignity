Dignity
-----
Dignity is a node js module that creates a layer based on user to check his/her roles and permissions

[![Build Status](https://travis-ci.org/sendyHalim/dignity.svg)](https://travis-ci.org/sendyHalim/dignity)

## ORMs Covered (for now)
* [Bookshelf](https://github.com/tgriesser/bookshelf)
* [Sequelize](https://github.com/sequelize/sequelize)

## IMPORTANT
FOR SEQUELIZE ONLY 
You need to define class method in your model definition for:
* `Role::getPermissionModel` for Role model in here's an example
  
  ```
  var Role = sequelize.define('roles', {
  		id: Sequelize.INTEGER,
  		name: Sequelize.STRING
  	}, {
  		tableName: 'roles',
  		timestamps: false,
  		classMethods: {
  		getPermissionModel: function () {
  			return Permission
  		}
  	}
  });
  ``` 
* `User::getRoleModel` for User model in here's an example
 
  ```
  var User = sequelize.define('users', {
  		id: Sequelize.INTEGER,
  		name: Sequelize.STRING
  	}, {
  		tableName: 'users',
  		timestamps: false,
  		classMethods: {
  		getRoleModel: function () {
  			return Role
  		}
  	}
  });
  ```
  
[complete example](https://github.com/sendyHalim/dignity/blob/master/test/models/sequelize-models/index.js)


##Usage
`npm install dignity --save`

```js
var dignity = require('dignity');

// sequelize

User.find(userId).then(function (result) {
  var layer = new dignity.SequelizeLayer(result);
  layer.analyzeDignity().then(function () {
    layer.is('ironman'); // check if user has role ironman
    layer.hasRole('destroyer'); // layer.is === layer.hasRole

    layer.can('play-dota') // check if user can play dota
    layer.hasPermission('play-dota') // layer.can === layer.hasPermission
  });
});


// bookshelf
(new User({
    id: 1
}))
.fetch()
.then(function (result) {
  var layer = new dignity.BookshelfLayer(result);
  layer.analyzeDignity().then(function () {
    layer.is('ironman'); // check if user has role ironman
    layer.hasRole('destroyer'); // layer.is === layer.hasRole

    layer.can('play-dota') // check if user can play dota
    layer.hasPermission('play-dota') // layer.can === layer.hasPermission
  });
});
```

To use `dignity` properly, you have to follow these conventions:

* Many to Many relation between `User` and `Role`, the name of the relation in User must be `roles`
* Many to Many relation between `Role` and `Permission`, the name of the relation in Role must be `permissions`

## Too lazy to make migration file?
`dignity` has a command line tool to make migration file (based on [knex](https://github.com/tgriesser/knex))

Steps:
* install knex `npm install knex -g`
* init the knexfile `knex init` and input your db config in `knexfile.js`
* create the migration `dignity create-migration` or `dignity create-migration > ./migrations/dignity-migration.js`
* now you can run the migration `knex migrate:latest` :D

## Layer API
* `getUser()` get the user.
* `setUser(user)` set user,it will automaticaly run `analyzeDignity`, so u can use it like this `layer.setUser(user).then(function () { /* do something */ })`.
* `getPermissions()` returns an array of permissions.
* `getRoles()` returns an array of roles.
* `is(String|Array)` check role, example `layer.is('ironman')` `layer.is(['ironman', 'admin'])`. For array convention, it returns true satisfy if user has one of the given roles.
* `can(String|Array)` check permission, example `layer.can('playing')` `layer.is(['playing', 'edit post'])`. For array. convention, it returns true satisfy if user has one of the given permission

## Testing
You must have `sqlite3` installed in your system, `npm test`

## NOTE
For now `dignity` leaves the creation of roles and permissions by yourself since it's responsibility is only to check the `dignity` of the given user.


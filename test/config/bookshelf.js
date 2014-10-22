var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: 'bookshelfjs-test.sqlite'
  }
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
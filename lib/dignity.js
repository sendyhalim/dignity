var BookshelfLayer = require('./layers/bookshelf-layer');


var analyzeDignity = function analyzeDignity (user, orm) {
  orm = orm.toLowerCase();

  switch (orm) {
    case 'bookshelf': return new BookshelfLayer(user);
                      break;

    default: throw new Error('Layer is not supported');
  }
};

module.exports = {
  analyzeDignity: analyzeDignity
};
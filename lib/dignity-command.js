#!/usr/bin/env node

var program  = require('commander');
var dignityPackageJson = require('../package.json');
var fs = require('fs');

program
  .version(dignityPackageJson.version)
  .usage('create-migration')
  .parse(process.argv);


if (!program.args.length) {
  program.help();
} else {
  if (program.args[0] === 'create-migration') {
    fs.readFile(__dirname + '/migration/index.js', 'utf-8', function (err, result) {
      if (err) {
        throw err;
      }

      console.log(result);
    });
  } else {
    console.warn("To create migration please use 'dignity create-migration'");
  }
}
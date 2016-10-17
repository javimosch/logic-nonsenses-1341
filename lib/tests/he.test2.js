var path = require("path");
var sander = require('sander');
var heParser = require('../he.utils.html-parser');
var heFirebase = require('../he.firebase');
var heUtils = require('../he.utils');
var heStyle = require('../he.styles');
var heScript = require('../he.scripts');
var Handlebars = require('handlebars');
var readDirFiles = require('read-dir-files');

//var basedir = process.cwd()+'/dist-production';
//var fileName = 'test.js';
//var content = '//test';
//console.log('util-createFile', basedir, fileName, content.length, ' characters');
///return sander.writeFile(basedir, fileName, content);


var rta = heUtils.normalizeFilesTreePreservePath(readDirFiles.readSync(process.cwd()+'/src/common/partials'));

console.info(JSON.stringify(rta))
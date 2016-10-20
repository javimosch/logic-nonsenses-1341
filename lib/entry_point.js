"use strict";
require('dotenv').config({
  silent: true,
  path: process.cwd()+'/.env'
});
var argv = require('yargs').argv;
var exeCute = require('exe');
var fs = require('fs');
var heBuild = require('./main').build;
var heWatch = require('./main').watch;
var heOptions = require('./main').options;
var heLoads = require('./main').load;
var heConfig = require('./config');
var heUtils = require('./core/utils');
var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var config = require('./config').multipleConfig;
var APPNAME = argv.app || process.env.app || config.app || process.env.APP_NAME;
config.app = APPNAME;
console.log('DEBUG: CURRENT APP_NAME ->', APPNAME);
heUtils.ensureDirectory(process.cwd() + '/dist');
heUtils.ensureDirectory(process.cwd() + '/dist-production');
heUtils.ensureDirectory(process.cwd() + '/dist-production/' + APPNAME);
heOptions.setApp(config.app, config.apps[config.app]);
heOptions.dest('dist', 'dist-production');


heBuild.all().then(() => {
  if (process.env.PROD == 1) {
    if (!process.env.ALIVE) {
      process.exit(0);
    }
    else {
      process.exit(0);
    }
    return;
  }
  heWatch.templates();
  heWatch.scripts();
  heWatch.styles();
});

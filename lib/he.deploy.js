var argv = require('yargs').argv;
var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();
var fs = require('fs');
require('dotenv').config();

//var heBuild = require('./he').build;
//var heOptions = require('./he').options;
//var heLoads = require('./he').load;
var heUtils = require('./he.utils');


var g = {
    dest: process.cwd() + '/dist-production'
};


var target = argv.target;

var APP_NAME = process.env.APP_NAME;

console.log('APP_NAME', process.env.APP_NAME)

var config = require(process.cwd() + '/configs/config-' + APP_NAME);

var auth = {
    hostname: config.deploy && config.deploy.ftp && config.deploy.ftp.hostname,
    port: config.deploy && config.deploy.ftp && config.deploy.ftp.port || 21,
    username: config.deploy && config.deploy.ftp && config.deploy.ftp.username,
    password: config.deploy && config.deploy.ftp && config.deploy.ftp.password
};

if (!config.deploy) {
    console.log('DEPLOY: check deploy section', APP_NAME);
    process.exit(0);
}

if (!config.deploy.ftp) {
    console.log('DEPLOY: check deploy.ftp section', APP_NAME);
    process.exit(0);
}


if (!auth.hostname || !auth.port || !auth.username || !auth.password) {
    console.log('DEPLOY: check authentification for', APP_NAME, 'auth', JSON.stringify(auth));
    process.exit(0);
}

var ftpConfig = {
    username: auth.username,
    password: auth.password,
    host: auth.hostname,
    port: auth.port || 21,
    localRoot: process.cwd() + "/dist-production",
    remoteRoot: "/"+ ((config.deploy.ftp.remoteRoot)?config.deploy.ftp.remoteRoot+'/':''),
    exclude: ['.git', '.idea', 'tmp/*', 'vendor']
}

upload();

function upload() {
    console.log('DEPLOY: ftp configuration', ftpConfig);

    console.log('DEPLOY: debug-deploy-start');

    ftpDeploy.on('upload-error', function(data) {
        console.log('DEPLOY: debug-deploy-error', data.err); // data will also include filename, relativePath, and other goodies
    });

    ftpDeploy.on('uploading', function(data) {
        //data.totalFileCount; // total file count being transferred
        //data.transferredFileCount; // number of files transferred
        //data.percentComplete; // percent as a number 1 - 100
        //data.filename; // partial path with filename being uploaded
        //console.log('deploy', data.filename, data.percentComplete + ' %', data.transferredFileCount + '/' + data.totalFileCount);
    });
    ftpDeploy.on('uploaded', function(data) {
        //console.log(data); // same data as uploading event
        console.log('DEPLOY: ', data.filename, 'uploaded');
    });

    ftpDeploy.deploy(ftpConfig, function(err) {
        if (err) console.log(err)
        else {
            console.log('DEPLOY: debug-deploy-success');

            heUtils.deleteFiles([g.dest + '/**/*.*']).then(() => {
                heUtils.deleteFiles([g.dest]).then(() => {
                    process.exit(0);
                });
            });

        }

    });

}

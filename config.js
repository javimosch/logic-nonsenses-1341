var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var ROOT_MODE = process.env.ROOT_MODE && process.env.ROOT_MODE.toString() == '1' || false;
ROOT_MODE = ROOT_MODE || PROD;

var fs = require('fs');
var configsFileNames = fs.readdirSync(process.cwd() + '/configs');
var config = {
	app: process.env.APP_NAME || 'unkown', //default app
};
configsFileNames.forEach(path => {
	var n = path.replace('.js', '').replace('config-', '');
	console.log('DEBUG: loading config ' + n);
	config.apps = config.apps||{};
	config.apps[n] = require(process.cwd() + '/configs/' + path);
	if (!config.apps[n].root) {
		if (ROOT_MODE) {
			config.apps[n].root = '/';
		}
		else {
			config.apps[n].root = '/' + n + '/';
		}

	}
	if (!config.apps[n].res) {

		if (ROOT_MODE) {
			config.apps[n].res = '/';
		}
		else {
			config.apps[n].res = '/' + n + '/';
		}
	}
	//console.log(config.apps[n]);
});
module.exports = config;

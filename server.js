require('dotenv').config({
	silent: true
});

var express = require('express');
var path = require("path");
var app = express();
var http = require('http').Server(app);
var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var port = process.env.PORT || 3000;
var config = require('./config.js');
var btoa = require('btoa');
require('dotenv').config();
var fs = require('fs');

var dest = 'dist';


var appStaticResPaths = ['img', 'fonts', 'images', 'includes', 'files', 'templates', 'lib', 'styles', 'css', 'js'];

function setStaticPaths() {
	appStaticResPaths.forEach(n => {
		console.log('route rule (static) ->', '/' + n + '/*')
		app.use('/' + n, express.static(dest + '/' + n));
	});
}

function setProductionRoutes() {
	app.get('/', function(req, res, next) {
		res.sendFile('/index.html', {
			root: __dirname + '/' + dest
		});
	});

	//app root (if any)
	app.get('/*', function(req, res, next) {
		res.sendFile('/app/index.html', {
			root: __dirname + '/' + dest
		});
	});
}




if (PROD) {
	dest = 'dist-production';

	setStaticPaths();
	setProductionRoutes();
	startServer();
}
else {




	setStaticPaths();

	//CORS
	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-PUSH");
		//console.log(req.method, 'Setting CORS');
		if ('OPTIONS' == req.method) {
			return res.send(200);
		}
		next();
	});


	function getPath(s) {
		try {
			return fs.realpathSync(s);
		}
		catch (e) {
			return false;
		}
	}

	function replaceAll(target, search, replacement) {
		return target.replace(new RegExp(search, 'g'), replacement);
	};
	//

	//static
	app.use('/', express.static('./' + dest));
	//vendor
	app.use('/vendor', express.static('./vendor'));
	app.use('/bower', express.static('./bower'));
	var _route = '';
	Object.keys(config.apps).forEach(appName => {
		//each prj has /vendor
		_route = '/' + appName + '/vendor';
		app.use(_route, express.static('./vendor'));
		console.log('static-content - vendor - routing ' + _route);
	});
	//root route render APP_NAME index
	app.get('/', function(req, res, next) {
		res.sendFile(process.env.APP_NAME + '/index.html', {
			root: __dirname + '/' + dest
		});
	});


	appStaticResPaths.forEach(n => {
		Object.keys(config.apps).forEach(appName => {
			var path = getPath(process.cwd() + '/src/res/' + appName + '/' + n);
			if (path == false) return;
			var route = '/' + appName + '/' + n;
			app.use(route, express.static(path));
			console.log('static-path', route);




			app.get('/' + appName, function(req, res, next) {
				res.sendFile('/' + appName + '/index.html', {
					root: __dirname + '/' + dest
				});
			});

			//app root (if any)
			app.get('/' + appName + "/*", function(req, res, next) {
				res.sendFile('/' + appName + '/app/index.html', {
					root: __dirname + '/' + dest
				});
			});

		});
	});


	//Allow projects to fetch html templates from /templates/[path]
	//Search in the default (APP_NAME) project under src/res/templates
	var CURRENT_APP_NAME = process.env.APP_NAME || '[DEFAULT_PROJECT_NAME]';
	app.get('/templates/:name', function(req, res) {
		var name = req.params.name;
		var url = req.protocol + '://' + req.get('host');
		fs.readFile(process.cwd() + '/src/res/' + CURRENT_APP_NAME + '/templates/' + name, 'utf-8', function(err, page) {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			if (err) {
				page = 'error';
				console.log(err);
			}
			//res.write(replaceAll(page, 'href="', 'href="' + url + '/' + appName + '/partial/'));
			res.write(page);
			res.end();
		});
	});

	var ROOT_MODE = process.env.ROOT_MODE && process.env.ROOT_MODE.toString() == '1' || false;
	if (ROOT_MODE) {

		//STATIC
		appStaticResPaths.forEach(n => {
			var path = getPath(process.cwd() + '/src/res/' + CURRENT_APP_NAME + '/' + n);
			if (path == false) return;
			var route = '/' + n;
			app.use(route, express.static(path));
			console.log('static-path (ROOT_MODE)', route);
		});


		setProductionRoutes();
	}

	startServer();


}

function startServer() {
	http.listen(port, function() {
		console.log('server - Production? ' + (PROD ? 'Oui!' : 'Non!'));
		console.log('server - listening on port ' + port + '!');
	});
}
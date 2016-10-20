"use strict";
let co = require("co");
var heParser = require('./he.utils.html-parser');
var heFirebase = require('./he.firebase');
var heUtils = require('./he.utils');
var heStyle = require('./he.styles');
var heScript = require('./he.scripts');
var Handlebars = require('handlebars');
var readDirFiles = require('read-dir-files');
var mkdirp = require('mkdirp');
var fs = require('fs');
var heConfig = require('./he.config');
var path = require('path');
var COMMON_PATH = process.cwd() + '/src/common/partials';
var SRC = './src/static';
//var DIST = './dist';
var PATH = './src/partials';
var PARTIALS_EXT = 'html';
var global_partials = null;
var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var APP_NAME = process.env.APP_NAME || process.env.app || process.env.APP || null;

Handlebars.registerHelper('file', function(options) {
    var p = options.fn(this);
    var raw = fs.readFileSync(process.cwd() + p)
    return raw;
});



Handlebars.registerHelper('printCSS', function(options) {
    if (PROD) {
        return heStyle.cssTagTemplate({
            href: '/css/app.css'
        });
    }
    else {
        if (!APP_NAME) {
            return '<!-- printCSS: APP_NAME required -->';
        }
        return heStyle.printCSSTags(path.join('/', APP_NAME, 'css', 'raw'))
    }
});

Handlebars.registerHelper('printJS', function(options) {
    if (PROD) {
        return heScript.tagTemplate({
            src: '/js/app.js'
        });
    }
    else {
        if (!APP_NAME) {
            return '<!-- printJS: APP_NAME required -->';
        }
        return heScript.printTags(path.join('/', APP_NAME, 'js', 'raw'))
    }
});



var _watches = {};

function dataFromRequire(filePath, propertyName) {
    var data = {};
    if (propertyName) {
        data = require(filePath)[propertyName];
    }
    else {
        data = require(filePath);
    }
    loadData(data);

    if (typeof _watches[filePath] === 'undefined') {
        _watches[filePath] = true;
        try {
            heUtils.watch([filePath + '.js'], () => dataFromRequire(filePath, propertyName));
        }
        catch (e) {
            console.log('debug-warning', 'watch hook failed', e);
        }
    }
}

function loadData(d) {
    //Object.assign(data, d);
}

function loadDataJSON(path) {
    //var data = fs.readFileSync(path);
    //loadData(JSON.parse(data));
}

var _events = {};

module.exports = {
    pathPartials: (p) => PATH = p,
    pathStatic: (p) => SRC = p,
    dataFromRequire: dataFromRequire,
    loadData: loadData,
    loadDataJSON: loadDataJSON,
    dest: (dest) => {
        //DIST = dest;
    },
    watch: () => {
        watchPartials();
        watchSrc();
    },
    build: build,
    on: (evt, handler) => {
        _events[evt] = _events[evt] || [];
        _events[evt].push(handler);
    }
}

function build() {
    return new Promise((resolve, error) => {
        co(function*() {
            yield buildTemplatesPartials(COMMON_PATH);
            yield buildTemplatesPartials();
            yield buildTemplates();
            resolve(true);
        }).catch(function(err) {
            console.log(err);
        });

    });
}

function emit(evt, p) {
    _events[evt] = _events[evt] || [];
    _events[evt].forEach(handler => handler(p));
}

function watchSrc() {
    //console.log('DEBUG: Waching Static Folder: ' + SRC);
    heUtils.watch(SRC, () => {
        buildTemplates();
    });
}

function watchPartials() {
    //console.log('DEBUG: Waching Partials Folder: ' + PATH);
    heUtils.watch(PATH, build);
}

function* buildTemplatesPartials(src, append) {
    return new Promise(function(resolve, err) {
        co(function*() {
            if (!fs.existsSync(src || PATH)) return console.log('DEBUG:  tpl partials skip for', src || PATH);
            global_partials = heUtils.normalizeFilesTreePreservePath(readDirFiles.readSync(src || PATH));
            global_partials = heUtils.filesIncludeOnly(global_partials, PARTIALS_EXT);
            let keys = Object.keys(global_partials),
                key = null,
                name, remoteData, isAfter = false;
            for (var x in keys) {
                key = keys[x];
                name = key.substring(key.lastIndexOf('/') + 1);
                name = name.substring(0, name.lastIndexOf('.') !== -1 && name.lastIndexOf('.') || undefined);
                let fullPath = path.join(src || path.join(process.cwd(), PATH), key);
                //Fetch the file data from firebase (if any)
                //remoteData = yield heFirebase.getPartialContent(fullPath);
                //If file modified date is after firebase file date, we use the file content. If not, we use the firebase file.
                //if(remoteData){
                //    isAfter = yield heUtils.fileIsAfterDate(fullPath, remoteData.updatedAt);    
                // }else{
                isAfter = false;
                //    console.log('WARN: Firebase data not found',name);
                // }

                if (isAfter) {
                    Handlebars.registerPartial(name, heUtils.urldecode(remoteData.content)); //We finally register the handlebar partial
                    console.log('TEMPLATES: Using firebase version for ', name);
                }
                else {
                    //If we plan to use the local file data, we send the file to firebase
                    heFirebase.sendPartial(name, global_partials[key], fullPath); //async
                    Handlebars.registerPartial(name, global_partials[key]); //We finally register the handlebar partial
                }
                //console.log('DEBUG: Partial registered', name);
            }
            //console.log('DEBUG: partials',global_partials);
            resolve(true);
        }).catch(function(err) {
            console.log('WARN: Templates Partials compile error', err);
        });
    });
}

function compileTemplates(src, path) {
    //console.log('Compiling', path);
    var rta = Handlebars.compile(src)(heConfig());
    return rta;
}


var vendorData = {};

function vendorChanges(path, arr) {
    if (!vendorData[path]) {
        vendorData[path] = arr;
        return true;
    }
    else {
        if (arr.length !== vendorData[path].length) {
            vendorData[path] = arr;
            return true;
        }
        else {

            for (var x in vendorData[path]) {
                if (vendorData[path][x] !== arr[x]) {
                    vendorData[path] = arr;
                    return true;
                }
            }
            return false;
        }
    }
}

function compileVendorCustom(opt) { //{{root}}
    var raw = opt.content,
        path = opt.path,
        ext = opt.ext,
        replaceCb = opt.replaceWith,
        tagName = opt.tagName,
        tagAttributeName = opt.tagAttribute;
    //
    var outputFileName = opt.outputFileName || 'vendor';
    var sectionName = opt.sectionName || ('VENDOR-' + ext.toUpperCase());
    if (heParser.hasSection(sectionName, raw)) {


        var params = heParser.getSectionParameters(sectionName, raw);

        if (params && params.name) {
            outputFileName = params.name;
        }

        var buildPath = heConfig().output(ext + '/' + outputFileName + '.' + ext);
        buildPath = buildPath.replaceAll('//', '/');
        var sectionRaw = heParser.getSection(sectionName, raw);

        //if (opt.sectionName.indexOf('BUNDLE_JS_5') != -1) {
            //console.log('sectionRaw: ', sectionRaw);
        //}

        var arr = heParser.readTags(sectionRaw, tagName, tagAttributeName);
        //
        var _url = heConfig().root + '/' + ext + '/' + outputFileName + '.' + ext;
        _url = _url.replaceAll('//', '/');
        //console.log('he script vendor url',_url);
        var _replaceWith = replaceCb(_url);
        //console.log('he script vendor section',_replaceWith);
        //
        arr = arr.map(i => i = i.replace(heConfig().root, '/'));


        arr.forEach((path) => {
            emit('file-dependency', process.cwd() + '/' +
                path);
        });

        if (process.env.PROD && process.env.PROD.toString() === '1') {

        }
        else {
            return raw; //do not remplace on dev env
        }

        if (!vendorChanges(ext, arr)) {
            return heParser.replaceSection(sectionName, raw, _replaceWith);
        }

        var compiledCode = heUtils.concatenateAllFilesFromArray(arr);
        if (opt.middleWare) {
            compiledCode = opt.middleWare(compiledCode);
        }
        heUtils.createFile(buildPath, compiledCode);
        console.log('DEBUG: bundle output ' + buildPath + ' success at '); // + new Date());
        raw = heParser.replaceSection(sectionName, raw, _replaceWith);
        return raw;
    }
    else {
        return raw;
    }
}

function compileVendorCSS(raw, path) {
    return compileVendorCustom({
        content: raw,
        path: path,
        ext: 'css',
        replaceWith: dest => {
            return "<link rel='stylesheet' href='" + dest + "' type='text/css' />";
        },
        tagName: 'link',
        tagAttribute: 'href',
        middleWare: _raw => {
            //heStyles.minify(_raw);
            return _raw;
        }
    });
}

function compileVendorJS(raw, path) {
    return compileVendorCustom({
        content: raw,
        path: path,
        ext: 'js',
        replaceWith: dest => {
            return '<script src="' + dest + '"></script>';
        },
        tagName: 'script',
        tagAttribute: 'src',
        middleWare: _raw => {
            //heStyles.minify(_raw);
            return _raw;
        }
    });
}

function compileSectionBundles(raw, path) {
    var has = true;
    for (var x = 0; x < 10; x++) {
        if (has && heParser.hasSection('BUNDLE_JS_' + (x + 1), raw)) {
            raw = compileVendorCustom({
                outputFileName: 'bundle_' + (x + 1).toString(),
                sectionName: 'BUNDLE_JS_' + (x + 1),
                content: raw,
                path: path,
                ext: 'js',
                replaceWith: dest => {
                    return '<script src="' + dest + '"></script>';
                },
                tagName: 'script',
                tagAttribute: 'src',
                middleWare: _raw => {
                    //heStyles.minify(_raw);
                    return _raw;
                }
            });
            //console.log('ss debug templates make bundle ' + (parseInt(x) + 1));
        }
        else {
            has = false;
        }
    }
    return raw;
}

function buildTemplates() {

    console.log('DEBUG: build static');

    return new Promise((resolve, error) => {


        if (global_partials == null) {
            //not ready yet;
            console.error('DEBUG: build static no partials yet');
            process.exit(1);
            return;
        }

        //console.log('TEMPLATES:BUILD:STATIC', heConfig().output());


        //console.log('ss debug templates building to ['+heConfig().output()+']');

        function compile(raw) {
            return Handlebars.compile(raw)(heConfig())
        }

        function needsCompilation(raw, path) {
            return raw.indexOf('HBSIGNORE') == -1;
        }

        function handleNewFileTransform(raw, path) {
            var rta = raw;
            if (needsCompilation(raw, path)) {
                var rta = Handlebars.compile(raw)(heConfig());
                rta = compileVendorJS(rta, path);
                rta = compileVendorCSS(rta, path);
                rta = compileSectionBundles(rta, path);
                //console.log('DEBUG: ',path,'compiled');
            }
            else {
                //console.log('DEBUG: ',path,'skip');
            }
            return rta;
        }

        heUtils.copyFilesFromTo(SRC, heConfig().output(), {
            formatPathHandler: (path) => {
                if (path.indexOf('index') !== -1) {
                    path = path.substring(0, path.lastIndexOf('index')) + 'index.html';
                }
                return path;
            },
            formatContentHandler: (raw, path) => {

                //console.log('DEBUG:', path, 'format handler');

                var rta = raw;
                try {
                    rta = handleNewFileTransform(raw, path);
                }
                catch (e) {
                    rta = raw;
                    console.log('WARN: templates compiling fail', e);
                    throw e;
                }

                //console.log('building templates writing',rta.length,'chars...');

                return rta;

            }
        }).then((res) => {
            console.log('DEBUG: templates build ' + (res.ok ? 'success' : 'with errors') + ' at ' + new Date());
            emit('build-success');
            resolve();
        })
    });

}

var heUtils = require('./he.utils');
var heConfig = require('./he.config');
var heFirebase = require('./he.firebase');
module.exports = {
    watch: () => {
        var path = process.cwd() + '/src/'+heConfig().appName+'/res';
        console.log('DEBUG: RES watch at', path);
        heUtils.watch(path, () => {
            heFirebase.sendSignal('reload')
        });
    }
};

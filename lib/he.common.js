var heUtils = require('./he.utils');
var heConfig = require('./he.config');
var heFirebase = require('./he.firebase');
module.exports = {
    watch: () => {
        var path = process.cwd() + '/src/common';
        console.log('DEBUG: common watch at', path);
        heUtils.watch(path, () => {
            heFirebase.sendSignal('reload', {
                full_reload: true
            })
        });
    }
};

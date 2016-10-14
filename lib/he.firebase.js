var firebase = require("firebase");
var fs = require('fs');
var ref, appName, fireApp;
var heConfig = require('./he.config');
var heUtils = require('./he.utils');
var urlencode = require('urlencode');
module.exports = {
    init: (data) => {
        appName = data.appName;
        fireApp = firebase.initializeApp({
            serviceAccount: process.cwd() + "/getabiker-0950b8f9f7c8.json",
            databaseURL: "https://getabiker-1276e.firebaseio.com"
        });

        console.log('LIVE-SYNC: firebase signalName', data.signalName);

        data.signalName = data.signalName || data.appName;

        if (!data.signalName) {
            return console.log('WARN: LIVE-SYNC firebase cannot identify signalName or appName');
        }

        require('getmac').getMac(function(err, macAddress) {
            if (err) throw err
            console.log('LIVE-SYNC: MAC -> '+macAddress)
        })

        ref = fireApp.database().ref(data.signalName || data.appName);

         fireApp.database().ref('/admin/partials').remove();

    },
    sendSignal: (evt, extraPayload) => {
        var payload = {};
        var now = new Date().getTime();
        payload[evt] = now;

        for (var x in extraPayload) {
            payload[x] = extraPayload[x];
        }

        ref.child('signals').update(payload);
        console.log('LIVE-SYNC: sending signal to ' + heConfig().signalName || heConfig().appName, JSON.stringify(payload));
        console.log('LIVE-SYNC: WAITING CHANGES');
    },
    sendPartial: (fileName, content) => {



        if (!appName) {
            return console.log('WARN: DATABASE (FIREBASE) sendPartial appName null');
        }
        //console.log('DEBUG: sending partial ', fileName);
        try {
            var ref = fireApp.database().ref('/admin/partials');

            var data = {};
            var id = (appName + '_' + fileName);
            //console.log('DATABASE: ID 1',id);
            id = id.split('.').join('__');
            //console.log('DATABASE: ID 2',id);
            data[id] = {
                fileName: fileName,
                content: urlencode(content)
            };
            ref.update(data);
        }
        catch (e) {
            console.log('DATABASE (FIREBASE): sending partial error', e);
        }
        //console.log('DEBUG: successs for partial ', fileName);



    }
}

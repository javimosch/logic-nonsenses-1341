var firebase = require("firebase");
var fs = require('fs');
var ref,appName;
var heConfig = require('./he.config');
module.exports = {
    init: (data) => {
        appName = data.appName;
        var fireApp = firebase.initializeApp({
            serviceAccount: process.cwd() + "/getabiker-0950b8f9f7c8.json",
            databaseURL: "https://getabiker-1276e.firebaseio.com" 
        });
        
        console.log('LOG firebase signalName',data.signalName);
        
        data.signalName = data.signalName || data.appName;
        
        ref = fireApp.database().ref(data.signalName||data.appName);
    },
    sendSignal: (evt,extraPayload) => {
        var payload = {};
        var now = new Date().getTime();
        payload[evt] = now;
        
        for(var x in extraPayload) {
            payload[x] = extraPayload[x];
        }
        
        ref.child('signals').update(payload);
        console.log('Sending signal to ' + heConfig().signalName||heConfig().appName,JSON.stringify(payload));
    }
}

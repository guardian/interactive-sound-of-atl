var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        $('.sound-of').addClass('sound-of--enhanced');
    },

    canBeEnhanced: function() {
        if(this.getiOSVersion() >= 10 || this.getiOSVersion() === undefined) {
            return true;
        }
    },

    getiOSVersion: function() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return parseInt(v[1], 10);
        }
    }
}
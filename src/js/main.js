// Javascript that is inline. Should be used for anything that needs to be immediate
window.$ = require('./vendor/jquery.js');

var share = require('./modules/share.js');
var toggles = require('./modules/toggles.js');
var player = require('./modules/player.js');

share.init();
toggles.init();
player.init();
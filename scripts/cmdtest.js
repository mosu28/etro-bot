/**
 * filename: cmdtest.js
 */

var Fs = require('fs');

// var config = {path: process.env.HUBOT_FILE_BRAIN_PATH};
var config = {path: "../brain.json"};

module.exports = function (robot) {
	robot.respond(/load/i, function (msg) {
		msg.send(process.env.HUBOT_TRELLO_BOARD);
		if (!config.path) {
			msg.send('process.env.HUBOT_FILE_BRAIN_PATH is not defined');
			return;
		}
		robot.brain.setAutoSave = false;
		if (Fs.existsSync(config.path)) {
			var data = JSON.parse(Fs.readSync(config.path), {encoding: 'utf-8'});
			msg.send(data);
		} else {
			msg.send('ERROR!');
		}
	});
}
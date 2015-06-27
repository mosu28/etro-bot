/**
 * Description:
 * 	Redis Test
 *
 * commands:
 * 	hubot set-test
 * 	hubot get-test
 *
 * Authors:
 * 	tibimosu
 */

var redistogo = require('../module/redistogo.js');

module.exports = function (robot) {
	robot.respond(/set-test (.*)/i, function (msg) {
		var set_key = 'test';
		var set_val = msg.match[1];
		var client = redistogo.createClient(process.env.REDISTOGO_URL);
		if (!redistogo.checkClient(client)) {
			msg.send('ERROR!!');
			return;
		}
		client.set(set_key, set_val, function (err, keys_relies) {
			if (err) {
				throw err;
			} else {
				msg.send('set');
			}
		});
	});
	robot.respond(/get-test (.*)/i, function (msg) {
		var get_key = msg.match[1];
		var client = redistogo.createClient(process.env.REDISTOGO_URL);
		// var c = new SlackClient(process.env.HUBOT_SLACK_TOKEN, true, true);
		// var channel = c.getChannelGroupOrDMByID(msg.channel);
		// msg.send(channel.name);
		client.get(get_key, function (err, get_val) {
			if (err) {
				throw err;
			} else if (get_val) {
				msg.send(get_key + ':' + get_val);
			} else {
				msg.send('not found.');
			}
		});
	});
}

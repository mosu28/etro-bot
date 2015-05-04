/**
 * Filename: showtask.js
 * Description: 指定したリスト名のタスクを表示します
 * Command: show <listname> 
 */

var Trello = require("node-trello");
var _ = require("underscore");

function showTasks (t, list_id) {
	msg.send(list_id);
	t.get("/1/lists/" + list_id + "/cards", function (err, data) {
		if (err) {
			msg.send("ERROR");
			return;
		}
		_.each(data, function (datum) {
			msg.send(datum.name);
		});
	});
}

function mainProcess (msg) {
	var listName = msg.match[1];
	var t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
	t.get("/1/boards/" + process.env.HUBOT_TRELLO_BOARD + "/lists", function (err, data) {
		if (err) {
			msg.send("ERROR");
			return;
		}
		_.each(data, function (datum) {
			if (listName === datum.name) {
				msg.send(datum.id);
				showTasks(t, datum.id);
			}
		});
	});
}

module.exports = function (robot) {
	robot.respond(/show (.*)/i, function (msg) {
		mainProcess(msg);
	});
}
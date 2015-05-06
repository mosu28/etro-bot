/**
 * Filename: showtask.js
 * Description: 指定したリスト名のタスクを表示します
 * Command: show <listname> 
 */

var Trello = require("node-trello");
var _ = require("underscore");

function showTasks (t, msg, list_id) {
	t.get("/1/lists/" + list_id + "/cards", function (err, data) {
		if (err) {
			msg.send("ERROR");
			return;
		}
		_.each(data, function (datum) {
			msg.send("\t・" + datum.name);
		});
	});
}

function mainProcess (msg) {
	var listName = msg.match[1];
	var t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
	t.get("/1/boards/" + process.env.HUBOT_TRELLO_BOARD + "/lists", function (err, data) {
		var found = _.find(data, function (datum) {
			return datum.name === listName;
		});
		if (err) {
			msg.send("ERROR");
			return;
		} else if (!found) {
			msg.send("「" + listName + "リスト」は存在しません。以下のリスト名のいずれかを入力してください。");
			_.each (data, function (datum) {
				msg.send(datum.name);
			});
		} else {
			msg.send("～ " + listName + "のタスクリスト ～");
			showTasks(t, msg, found.id);
		}
	});
}

module.exports = function (robot) {
	robot.respond(/show (.*)/i, function (msg) {
		mainProcess(msg);
	});
}
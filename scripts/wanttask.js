/**
 * Filename: wanttask.js
 * Description: slackからWantlistにカードを追加できます
 * Command: want <task> 
 */

var Trello = require("node-trello");

function wantTask (msg) {
	var cardName = msg.match[1];
	var t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
	t.post("/1/cards", {name: title, idList: process.env.HUBOT_TRELLO_LIST}, function (err, data) {
			if (err) {
				msg.send "ERROR"
			} else {
				msg.send "「#{title}」をTrelloに保存しました。"
			}
	});
}

module.exports = function (robot) {
	robot.respond(/want (.*)/i, function (msg) {
		wantTask(msg);
	});
}

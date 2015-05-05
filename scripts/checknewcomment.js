/**
 * Filename: checknewcomment
 * Description: N分前までに新しいコメントがなかったかどうかチェックする
 * Command: check newcomment 後で周期的なイベントにする
 */

var N = 15; //何分前まで見るか
var Trello = require("node-trello");
var _ = require("underscore");
var _s = require("underscore.string");
var path = "/1/boards/process.env.HUBOT_TRELLO_BOARD/actions?filter=commentCard&limit=10";

function getDate (n) {
	var d = new Date();
	var year = d.getFullYear() + "";
	var month = _s(d.getMonth() + 1 + "").pad(2, "0").value();
	var day = _s(d.getDate() + "").pad(2, "0").value();
	var hour = _s(d.getHours() + "").pad(2, "0").value();
	var minute = _s(d.getMinutes() - n + "").pad(2, "0").value();
	var second = _s(d.getSeconds() + "").pad(2, "0").value();
	var date = _s.join("-", year, month, day);
	var time = _s.join(":", hour, minute, second) + ".000Z";
	return date + "T" + time;
}

function checkNewComment (old, now) {
	var t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
	t.get(path, function (err, data) {
		var fs = _.filter(data, function (datum) {return old < datum.date && datum.date <= now});
		if (err) {
			msg.send("ERROR");
			return;
		} else if (!fs) {
			msg.send("新しいコメントはありませんでした。");
		} else {
			_.each(fs, function (f) {
				msg.send(f.memberCreator.fullname + "より新しいコメントがありました。");
				msg.send("List: " + f.data.list.name);
				msg.send("Card: " + f.data.card.name);
				msg.send('Comment: "' + f.data.text + '"');
			});
		}
	});
}

function mainProcess (msg) {
	// var now = get(0);
	// var old = get(N);
//	checkNewComment(old, now);
	msg.send("test");
	// msg.send(now);
	// msg.send(old);
}

module.exports = function (robot) {
	robot.respond(/check/i, function (msg) {
		mainProcess(msg);
	});
}
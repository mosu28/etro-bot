/**
 * Filename: checknewcomment
 * Description: N分前までに新しいコメントがなかったかどうかチェックする
 * Command: check newcomment 後で周期的なイベントにする
 */

var N = 15; //何分前まで見るか
var Trello = require("node-trello");
var _ = require("underscore");
var _s = require("underscore.string");
var path = "/1/boards/" + process.env.HUBOT_TRELLO_BOARD + "/actions?filter=commentCard&limit=10";

function getDate (n) {
	var now = new Date();
	var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() - n, now.getSeconds(), now.getMilliseconds());
	var year = date.getFullYear() + "";
	var month = _s(date.getMonth() + 1 + "").pad(2, "0").value();
	var day = _s(date.getDate() + "").pad(2, "0").value();
	var hour = _s(date.getHours() + "").pad(2, "0").value();
	var minute = _s(date.getMinutes() + "").pad(2, "0").value();
	var second = _s(date.getSeconds() + "").pad(2, "0").value();
	var d = _s.join("-", year, month, day);
	var t = _s.join(":", hour, minute, second) + ".000Z";
	return d + "T" + t;
}

//TODO 60字ごとに改行を入れる

function checkNewComment (msg, old, now) {
	var t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
	t.get(path, function (err, data) {
		var fs = _.filter(data, function (datum) {return old < datum.date && datum.date <= now});
		if (err) {
			msg.send("ERROR");
			return;
		} else if (fs == "") {
			msg.send("新しいコメントはありませんでした。");
		} else {
			_.each(fs, function (f, i) {
				// if (i !== 0) {
				// 	msg.send("-------------------------")
				// }
				msg.send("---\t" + f.memberCreator.fullName + "より新しいコメントがありました。\t---");
				msg.send("*List:*\t" + f.data.list.name);
				msg.send("*Card:*\t" + f.data.card.name);
				msg.send("*Date:*\t" + f.date);
				msg.send("*Comment: *\n\t" + f.data.text);
			});
		}
	});
}

function mainProcess (msg) {
	var now = getDate(0);
	var old = getDate(N);
	msg.send(now);
	msg.send(old);
//	checkNewComment(msg, old, now);
}

module.exports = function (robot) {
	robot.respond(/check/i, function (msg) {
		mainProcess(msg);
	});
}
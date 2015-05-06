/**
 * Filename: checknewcomment
 * Description: N分前までに新しいコメントがなかったかどうかチェックする
 * Command: check newcomment 後で周期的なイベントにする
 */

var N = 15; //何分前まで見るか
var Trello = require("node-trello");
var _ = require("underscore");
var _s = require("underscore.string");
var cron = require("cron");
var path = "/1/boards/" + process.env.HUBOT_TRELLO_BOARD + "/actions?filter=commentCard&limit=10";
var channel = {room: "enter-and-leave"};

function getDate (n) {
	var now = new Date();
	var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() - n, now.getSeconds(), now.getMilliseconds());
	var year = date.getFullYear() + "";
	var month = _s(date.getMonth() + 1 + "").pad(2, "0").value();
	var day = _s(date.getDate() + "").pad(2, "0").value();
	var hour = _s(date.getHours() + "").pad(2, "0").value();
	var minute = _s(date.getMinutes() + "").pad(2, "0").value();
	var second = _s(date.getSeconds() + "").pad(2, "0").value();
	var ms = _s(date.getMilliseconds() + "").pad(3, "0").value();
	var d = _s.join("-", year, month, day);
	var t = _s.join(":", hour, minute, second) + "." + ms + "Z";
	return d + "T" + t;
}

function formatDate (date) {
	var ds = [], ts = [], temp = [], ms;
	temp = _s.words(date, "T");
	ds = _s.words(temp[0], "-");
	temp = _s.words(temp[1], ".");
	ts = _s.words(temp[0], ":");
	ms = temp[1].replace(/Z*/g, "");
	var d = new Date(parseInt(ds[0]),parseInt(ds[1]) - 1,parseInt(ds[2]),parseInt(ts[0]) + 9,parseInt(ts[1]),parseInt(ts[2]),parseInt(ms));
	var year = d.getFullYear() + "";
	var month = _s(d.getMonth() + 1 + "").pad(2, "0").value();
	var day = _s(d.getDate() + "").pad(2, "0").value();
	var hour = _s(d.getHours() + "").pad(2, "0").value();
	var minute = _s(d.getMinutes() + "").pad(2, "0").value();
	var second = _s(d.getSeconds() + "").pad(2, "0").value();
	var ms = _s(d.getMilliseconds() + "").pad(3, "0").value();
	return _s.join("-", year, month, day) + "T" + _s.join(":", hour, minute, second) + "." + ms + "Z";
}

function checkNewComment (robot, old, now) {
	var t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
	t.get(path, function (err, data) {
		var fs = _.filter(data, function (datum) {
			return old < datum.date && datum.date <= now
		});
		if (err) {
			robot.send(channel, "ERROR");
			return;
		} else if (fs == "") {
			robot.send(channel, "新しいコメントはありませんでした。");
		} else {
			_.each(fs, function (f, i) {
				robot.send(channel, "---\t" + f.memberCreator.fullName + "より新しいコメントがありました。\t---");
				robot.send(channel, "*List:*\t" + f.data.list.name);
				robot.send(channel, "*Card:*\t" + f.data.card.name);
				robot.send(channel, "*Date:*\t" + formatDate(f.date));
				robot.send(channel, "*Comment: *\n\t" + f.data.text);
			});
		}
	});
}

function mainProcess (robot) {
	var now = getDate(0);
	var old = getDate(N);
	checkNewComment(robot, old, now);
}

module.exports = function (robot) {
	var cronjob = cron.job("0 */" + N + " * * * *", function () {
		mainProcess(robot);
	});
	robot.respond(/check start/i, function () {
		cronjob.start();
		robot.send(channel, "--- 「更新チェック機能」を起動します(" + N + "分おき) ---");
	});
	robot.respond(/check stop/i, function () {
		cronjob.stop();
		robot.send(channel, "-------- 「更新チェック機能」を終了します --------");
	});
}
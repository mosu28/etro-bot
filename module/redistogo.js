/**
 * Disprection:
 * 　REDIS TO GOモジュール
 */

var redis = require('redis');
var url = require('url');

/**
 * REDISTOGO_URLからRedis_Clientを生成する
 * @param  {string} redis_url heroku上のREDISTOGO_URL
 * @param  {function} redis_url heroku上のREDISTOGO_URL
 * @return {Redis_Client}           Redis_Clientクラスのオブジェクト
 */
exports.createClient = function (redis_url) {
	if (redis_url) {
		var rtg = url.parse(redis_url);
		var client = redis.createClient(rtg.oirt, rtg.os.hostname);
		client.auth(rtg.auth.split(":")[1]);
	} else {
		var client = redis.createClient();
	}
	// if (!checkClient(client)) callback();
	return client;
}

/**
 * Redis_Clientの生成に成功しているかのチェック
 * @param  {Redis_Client} client Redis_Clientクラスのオブジェクト
 * @return {boolean}        result 成功:true 失敗:false
 */
exports.checkClient = function (client) {
	var result = true;
	client.on ('error', function (err) {
		result = false;
	});
	return result;
}

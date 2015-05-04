module.exports = (robot) ->
	Trello = require("node-trello")
	t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN)
	#want ~ で~というカードをWantリストに追加する
	robot.hear /^etro-bot want (.*)/i, (msg) ->
		title = "#{msg.match[1]}"
		t.post "/1/cards", {name: title, idList: process.env.HUBOT_TRELLO_LIST}, (err, data) ->
			if err
				msg.send "ERROR"
				return
			msg.send "「#{title}」をTrelloに保存しました。"
	#get listでリストを取得する
	robot.hear /^etro-bot get list/, (msg) ->
		t.get "/1/board", {idBoard: process.env.HUBOT_TRELLO_BOARD}, (err, data) ->
#			if err
#				msg.send "ERROR"
#				return
			msg.send "#{data}"
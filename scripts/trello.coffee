module.exports = (robot) ->
	#want ~ で~というカードをWantリストに追加する
	robot.hear /^etro-bot want (.*)/i, (msg) ->
		title = "#{msg.match[1]}"
		Trello = require("node-trello")
		t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN)
		t.post "/1/cards", {name: title, idList: process.env.HUBOT_TRELLO_LIST}, (err, data) ->
			if err
				msg.send "ERROR"
				return
			msg.send "「#{title}」をTrelloに保存しました。"
	#get listでリストを取得する
	robot.hear /^etro-bot get list/, (msg) ->
		Trello = require("node-trello")
		t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN)
		t.get "/1/boards", {idBoard: process.env.HUBOT_TRELLO_BOARD}, (err, data) ->
			if err
				msg.send "ERROR"
				return
			msg.send "#{data}"
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
		list = t.get "/1/boards/#{process.env.HUBOT_TRELLO_BOARD}/lists", (err, data) ->
			if err
				return "ERROR"
			return data
		if list == "ERROR"
			msg.send "ERROR"
		else
			for i in [0..list.length - 1]
				msg.send list[i]

	# robot.hear /test/, (msg) ->
	# 	objs = [{name: "test"}, {name: "test1"}, {name: "test3"}]
	# 	for i in [0..objs.length - 1]
	# 		msg.send objs[i].name

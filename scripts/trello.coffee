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
		lists = t.get "/1/boards/#{process.env.HUBOT_TRELLO_BOARD}/lists", (err, data) ->
			if err
				return "ERROR"
			return data
		if lists == "ERROR"
			msg.send "ERROR"
		else
			for list in lists
				msg.send list.name

	# robot.hear /^etro-bot test/, (msg) ->
	# 	iss = [0, 1, 2, 3, 4]
	# 	for i in iss
	# 		msg.send i

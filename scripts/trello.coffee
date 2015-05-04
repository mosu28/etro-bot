module.exports = (robot) ->
	#want ~ で~というカードをWantリストに追加する
	robot.hear /^etro-bot want (.*)/, (msg) ->
		title = "#{msg.match[1]}"
		Trello = require("node-trello")
		t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN)
		t.post "/1/cards", {name: title, idList: process.env.HUBOT_TRELLO_LIST}, (err, data) ->
			if err
				msg.send "ERROR"
				return
			msg.send "「#{title}」をTrelloに保存しました。"
	#get リスト名 でリストのタスクをすべて表示する
	robot.hear /^etro-bot get (.*)/, (msg) ->
		listName = msg.match[1]
		Trello = require("node-trello")
		t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN)
		#list名とIDの取得
		t.get "/1/boards/#{process.env.HUBOT_TRELLO_BOARD}/lists", (err, data) ->
			if err
				msg.send "ERROR"
				return
			for i in [0..data.length - 1]
				if listName == data[i].name
					t.get "/1/lists/#{data[i].id}/cards", (err, data) ->
						if err
							msg.send "ERROR"
							return
						for j in [0, data.length - 1]
							msg.send data[i].name
							return
			msg.send "#{listName}は存在していません。"


	# robot.hear /test/, (msg) ->
	# 	objs = [{name: "test"}, {name: "test1"}, {name: "test3"}]
	# 	for i in [0..objs.length - 1]
	# 		msg.send objs[i].name

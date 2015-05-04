// module.exports = function(robot) {
//   robot.hear(/^etro-bot want (.*)/, function(msg) {
//     var Trello, t, title;
//     title = "" + msg.match[1];
//     Trello = require("node-trello");
//     t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
//     return t.post("/1/cards", {
//       name: title,
//       idList: process.env.HUBOT_TRELLO_LIST
//     }, function(err, data) {
//       if (err) {
//         msg.send("ERROR");
//         return;
//       }
//       return msg.send("「" + title + "」をTrelloに保存しました。");
//     });
//   });
//   return robot.hear(/^etro-bot get (.*)/, function(msg) {
//     var Trello, listName, t;
//     listName = msg.match[1];
//     Trello = require("node-trello");
//     t = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
//     return t.get("/1/boards/" + process.env.HUBOT_TRELLO_BOARD + "/lists", function(err, data) {
//       var i, k, ref;
//       if (err) {
//         msg.send("ERROR");
//         return;
//       }
//       for (i = k = 0, ref = data.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
//         if (listName === data[i].name) {
//           t.get("/1/lists/" + data[i].id + "/cards", function(err, data) {
//             var j, l, len, ref1, results;
//             if (err) {
//               msg.send("ERROR");
//               return;
//             }
//             ref1 = [0, data.length - 1];
//             results = [];
//             for (l = 0, len = ref1.length; l < len; l++) {
//               j = ref1[l];
//               results.push(msg.send(data[j].name));
//             }
//             return results;
//           });
//           return;
//         }
//       }
//     });
//   });
// };
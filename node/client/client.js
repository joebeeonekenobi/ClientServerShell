require("./nodewsclient.js")

main = function(){


	console.log("Main Loaded")

	ws = new WebSocketInstance("127.0.0.1:8080");
}

main();
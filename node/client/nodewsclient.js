console.log("nodewsclient.js loaded")
WebSocket = require('ws')

WebSocketInstance = function(address){

	ws = new WebSocket("ws://"+address);

	//console.log("Web Socket Client launched to address: " + address)

	ws.on("open", function(){

		//ws.send("Hello server, this is client speaking!");
	})

	ws.on("message", function(message){

		//console.log("Message received from server:" + message);
	})

	ws.on("close", function(){

		//console.log("Connection to server closed.");
	})

	return ws;
}
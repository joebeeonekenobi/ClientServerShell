console.log("nodewsserver.js loaded")
var WebSocketServer = require('ws').Server;

launchServer = function(port){

	var wss = new WebSocketServer({port: port,});

	wss.on('connection', function(ws){

		//Log the connection
		console.log("Connection from: "+ ws._socket.server._connectionKey)

		ws.on('message', function(message){
		
	        console.log('received: ', message);
	    });

		ws.on('close', function(){

			console.log('disconnected: '+ws._socket.server._connectionKey);
		});

	})

	return wss;
}

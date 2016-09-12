console.log("nodewsserver.js loaded")
WebSocket = require('ws');
WebSocketServer = WebSocket.Server;

WebSocketServerInstance = function(){

	this.launch = function(port){

		this.wss = new WebSocketServer({
				port: port,
			}
		);

		//console.log("Web Socket Server launched on port: " + port)
/*
		//Somehow this isnt overwritten by another declaration, it is called, as well as the "overwriting" event.... :(
		this.wss.on('connection', function(ws){

			console.log("Connection Open: " + ws._socket.remoteAddress+":"+ws._socket.remotePort)

			ws.send('Hello Client!');
			
		    ws.on('message', function(message){
			
				console.log("Received: " + message);
		    });

			ws.on('close', function(){

				console.log("Connection Closed: " + this._socket.remoteAddress+":"+this._socket.remotePort)
			});
				
		});
*/
	}


	return this;
}
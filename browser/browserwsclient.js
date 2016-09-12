console.log("browserwsclient.js loaded")

window.reconnectTime = 2000;

testConnection = function(){

	//openCommunications('80.5.29.190:8080')
	window.ws = openCommunications('127.0.0.1:8080')
}

updateConnectionState = function(state){

	console.log("connection now: "+state)
}

openCommunications = function(serverAddress){

	console.log("Attempting to establish connection to: "+serverAddress)

	var ws = window.ws = new WebSocket("ws://"+serverAddress);

	ws.onerror = function(error){

		console.log("WebSocket error: ")
		console.log(error)
	}
	
	ws.onopen = function(){

		updateConnectionState(true);
		//ws.send("Message to send");
	};
	
	ws.onmessage = function(message){
	
		console.log("Recieved: " + message.data)
	};
	
	ws.onclose = function(){

		updateConnectionState(false);

		setTimeout(testConnection, reconnectTime)
	};

	return ws;
}
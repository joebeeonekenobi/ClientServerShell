/*

	https://github.com/cloudhead/node-static

	Server will serve folder with each request, even if files are added and updated later on, changes will be served
*/

var NodeStatic = require('node-static');
var HTTP = require('http');

var directory = "./test"
var port = 8080;

//
// Create a node-static server instance to serve the './public' folder
//

var toServe = new NodeStatic.Server(directory);

HTTP.createServer(function (request, response) {

	var resolve = function (error, result) {

		// There was an error serving the file
		if (error) { 

			console.error("Error serving " + request.url + " - " + error.message);

			// Respond to the client
			response.writeHead(error.status, error.headers);
			response.end();
	    }
	    else if(result){

	    	console.log(result)
	    	console.log("Served successfully!")
	    }
	}

    request.addListener('end', function () {

        toServe.serve(request, response, resolve);

    }).resume();

}).listen(port);
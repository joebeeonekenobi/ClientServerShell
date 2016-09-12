require("./nodewsserver.js")

main = function(){

	console.log("main")

	wss = launchServer(8080);

}

main();
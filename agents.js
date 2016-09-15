agentTest = function(){

	var alice = new Agent("alice", {},  function(message, friends, data){

		friends.bob.notify(message)
	})

	var bob = new Agent("bob", {count : 0}, function(message, friends, data){

		data.count += parseInt(message);
		console.log("Count is now: "+data.count)
	})

	alice.addFriend(bob);

	document.body.onclick = function(e){

		var test = function(){

			alice.notify("1");
		}

		setTimeout(test, 0)
	}


}

Agent = function(key, data, personality){

	this.key = key || "";
	this.friends = {};
	this.data = data || {};

	this.personality = personality || function(message){

		//Called when notified.
	}

	this.notify = function(message){

		console.log("Notification recieved by: '"+this.key+"'");
		this.personality(message, this.friends, this.data);
	}

	this.addFriend = function(agent){

		this.friends[agent.key] = agent;
	}
}
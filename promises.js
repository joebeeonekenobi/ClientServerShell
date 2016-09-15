console.log("promises.js Loaded.")
promiseTest = function(){

	//A promise takes a function to run Synchronously, as soon as it is defined.
	//Within that function, you get the ability to call resolve or reject.

	new Promise((resolve, reject) => {

		console.log("Executing promise synchronously")

		//the promise will resolve when given the signal in 2000 ms
		setTimeout(() => resolve("myValue"), 2000);

		//but it wont matter because we are going to cause an error before it can.
		throw new Error("oh dear")
	})
	.then(
		(resultValue) => {
			//if the resolve function was called first, then this function would be called
			console.log("accepted : "+resultValue)
		},
		(rejectionValue) => {
			//but an error was raised, so the promise will be rejected, and this function will be called instead
			console.log("rejected : "+rejectionValue)
		}
	);
}
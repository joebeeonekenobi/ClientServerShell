console.log("OHMTML Loaded v3.4")

window.resizeEvents = {};

window.onresize = function(e){

	for(var i in window.resizeEvents){
		try{

			window.resizeEvents[i].activate();
		}
		catch(e){
			
		}
	}
}

OCUSTOM = function(type, name){

	this.element = document.createElement(type)

	OHTML.apply(this, [name]);
	return this;
}

OHTML = function(name){

	if(document.getElementById(name) != undefined){
		throw new Error("OHTML element \'"+name+"\' has the same name/id as a previously created element.")
	}

	this.name = name;
	this.parent = undefined;
	this.children = {};

	this.element.OHTML = this;
	this.element.id = name;
	this.listeners = {};
	this.isOHTML = true;

	this.get = function(name){

		try{

			return document.getElementById(name).OHTML;

		}
		catch(e){

			return undefined;
		}
	}

	this.recursiveGetChild = function(name){

		var check;

		for(var i in this.children){
			if(this.children[i].name === name){
				return this.children[i];
			}
			else{
				check = this.children[i].recursiveGetChild(name)
				if(check != undefined){
					return check;
				}
			}
		}

		throw new Error("Could not find child OHTML recursively: "+name)

		return undefined
	}

	/*
		Regular Methods
	*/
	this.width = function(width){

		this.element.style.width = width;

		//Return Monad Style
		return this;
	}

	this.innerHTML = function(innerHTML){

		this.element.innerHTML = innerHTML;

		//Return Monad Style
		return this;
	}

	this.class = function(className){

		this.element.className = className;

		//Return Monad Style
		return this;
	}

	this.height = function(height){

		this.element.style.height = height;

		//Return Monad Style
		return this;
	}

	this.display = function(display){

		this.element.style.display = display;

		//Return Monad Style
		return this;
	}

	this.setTabIndex = function(index){

		this.prop("tabIndex", index);
		return this;
	}

	this.toTopZed = function(){
	//Places the corresponding element to the top of the z index for the subtree that it is within, will also minimise z indices for sibling nodes

		this.minimiseZed();
		this.setZIndex(this.element.parentElement.children.length)
	}

	this.minimiseZed = function(){
	//Re adjusts all of the z-indices of the elements attached to this elements parent to be the lowest possible whilst maintaining their current order

		var subjects = this.element.parentElement.children;
		var subjectsZed = [];

		//Set the Z-index for all elements on this level
		for(var i=0; i<subjects.length; i++){
			subjects[i].style.zIndex = subjects[i].style.zIndex || 0;
			subjectsZed.push(parseInt(subjects[i].style.zIndex) || 0);
		}

		//Sort the elements according to their current z ordering in the array
		var sortedAscending = insertionSort(subjects, subjectsZed)

		//Set the z index of the elements to their array position (maintaining their order but minimizing their z)
		for(var i=0; i<sortedAscending.result.length; i++){
			sortedAscending.result[i].style.zIndex = i;
		}
	}

	this.setZIndex = function(index){

		this.style("z-index", index);
		return this;
	}

	this.focus = function(){

		this.element.focus()
		return this;
	}

	this.padding = function(padding){

		this.element.style.padding = padding;

		//Return Monad Style
		return this;
	}

	this.position = function(position){

		this.element.style.position = position;

		//Return Monad Style
		return this;
	}

	this.onclick = function(func){

		this.listen("onclick", func);

		//Return Monad Style
		return this;
	}

	this.onmouseover = function(func){

		this.listen("onmouseover", func);

		//Return Monad Style
		return this;
	}

	this.onmouseleave = function(func){

		this.listen("onmouseleave", func);

		//Return Monad Style
		return this;
	}
	
	this.onWindowResize = function(func){

		window.resizeEvents[this.name] = new Instruction(
			func,
			[this]
		)

		//Call once as soon as possible
		window.resizeEvents[this.name].activate();

		//Return Monad Style
		return this;
	}

	/*
		Standard Methods
	*/

	this.listen = function(listener, func){

		if(func == undefined){
			return;
		}
		if(func == null){
			return;
		}

		//Stores the function locally
		this.listeners[listener] = func;

		//Writes to the element the function 
		this.element[listener] = function(e, ohtml){

			//this = the element, so this.OHTML is the OHTML wrapper
			func(e, this.OHTML);
		};

		//Return Monad Style
		return this;
	}

	this.top = function(value){

		//Edit element property
		this.element.style.top = value;

		//Return Monad Style
		return this;	
	}

	this.left = function(value){

		//Edit element property
		this.element.style.left = value;

		//Return Monad Style
		return this;	
	}

	this.right = function(value){

		//Edit element property
		this.element.style.right = value;

		//Return Monad Style
		return this;	
	}

	this.bottom = function(value){

		//Edit element property
		this.element.style.bottom = value;

		//Return Monad Style
		return this;	
	}

	this.background = function(value){

		//Edit element property
		this.style("background-color", value);

		//Return Monad Style
		return this;
	}

	this.style = function(propertyName, value){

		//Edit element property
		this.element.style[propertyName] = value;

		//Return Monad Style
		return this;	
	}

	this.prop = function(propertyName, value){

		//Edit element property
		this.element[propertyName] = value;

		//Return Monad Style
		return this;
	}

	this.removeListeners = function(){

		//Remove listeners to prevent memory leak
		for(var i in this.listeners){
			this.element[i] = null;
			delete this.listeners[i]
		}
	}

	this.remove = function(){

		this.removeListeners();

		if(this.parent != undefined){

			//Delete parents reference to this
			delete this.parent.children[this.name];

			//Remove this parent reference
			this.parent = undefined;
		}

		//Literally remove this element
		this.element.remove();

		//Remove children
		this.removeChildren();
	}

	this.removeChildren = function(){

		//Call remove recursively on all children
		for(var c in this.children){

			this.children[c].remove();
		}
	}

	this.deAppend = function(){

		//remove the reference to this that the parent has
		delete this.parent.children[this.name];

		//remove the reference to this's parent
		this.parent = undefined;

		//Literally remove this element
		this.element.remove();

		//Return Monad Style
		return this;
	}

	this.append = function(OHTML){

		if(OHTML === undefined){
			throw new Error("No Argument Passed to append in OHTML. Did you mean appendToBody() ?")
		}

		//Reverse append
		OHTML.appendTo(this);

		//Return Monad Style
		return this;
	}

	this.appendTo = function(OHTMLContainer){

		//Catch for appending pure elements
		if(!(OHTMLContainer.isOHTML)){

			throw new Error("Cannot append non-OHMTL objects");
		}

		//Literally Append
		OHTMLContainer.element.appendChild(this.element);

		//Add parents reference to this
		OHTMLContainer.children[this.name] = this;

		//Add reference to parent in this
		this.parent = OHTMLContainer;

		//Return Monad Style
		return this;
	}

	this.appendToTopOf = function(OHTMLContainer){

		//Catch for appending pure elements
		if(!(OHTMLContainer.isOHTML)){
			throw new Error("Cannot append non-OHMTL objects");
		}

		//Literally Append
		if(OHTMLContainer.element.children.length != 0){
			OHTMLContainer.element.insertBefore(this.element, OHTMLContainer.element.children[0]);
		}
		else{
			OHTMLContainer.element.appendChild(this.element)
		}

		//Add parents reference to this
		OHTMLContainer.children[this.name] = this;
		//Add reference to parent in this
		this.parent = OHTMLContainer;

		//Return Monad Style
		return this;
	}

	this.appendToBody = function(){

		//Append to body
		document.body.appendChild(this.element);

		//focus the element
		this.element.focus();

		//Return Monad Style
		return this;
	}

	this.appendChildren = function(OHTMLArray){

		for(var i=0; i<OHTMLArray.length; i++){
			OHTMLArray[i].appendTo(this);
		}

		//Return Monad Style
		return this;
	}

	return this;
}

OIMG = function(name, src, onload){

	this.element = document.createElement("img")

	OHTML.apply(this, arguments);


	this.replaceImage = function(src, onload){

		this.listen("onload", onload)
		this.element.src = src;
	}

	this.replaceImage(src, onload)

	return this;
}

ODIV = function(name){

	this.element = document.createElement("div")

	this.prototype = OHTML;

	OHTML.apply(this, arguments);
	return this;
}

OTEXT = function(name, optionalElementTag){

	this.element = document.createElement(optionalElementTag || "p")

	this.prototype = OHTML;

	this.textValue = function(value){

		this.element.innerHTML = value;

		return this;
	}

	this.textSize = function(value){

		this.style("font-size", value);

		return this;
	}

	OHTML.apply(this, arguments);
	return this;
}

OCANVAS = function(name){

	this.element = document.createElement("canvas")

	this.prototype = OHTML;

	OHTML.apply(this, arguments);

	this.setIntuitiveCoordinates = function(bool){

		this.intuitiveY = bool;
		return this;
	}

	this.setContext = function(type){

		this.context = this.element.getContext(type);
		return this;
	}

	this.setFillStyle = function(arg){

		this.context.fillStyle = arg;
		return this;
	}

	this.setStrokeStyle = function(arg){

		this.context.strokeStyle = arg;
		return this;
	}

	this.setFont = function(arg){

		this.context.font = arg;
		return this;
	}

	this.setInternalResolution = function(width, height){

		//Sets the internal resolution of the canvas to be the specified arguments
		this.element.width = width;
		this.element.height = height;

		return this;
	}

	this.setExternalResolution = function(width, height){

		//Sets the internal resolution of the canvas to be the specified arguments
		this.width(width);
		this.height(height);

		return this;
	}

	this.setInternalToExternalResolution = function(){

		this.setInternalResolution(this.element.clientWidth, this.element.clientHeight)

		return this;
	}

	this.setExternalToInternalResolution = function(){

		this.width(this.element.width);
		this.height(this.element.height);

		return this;
	}

	this.clear = function(){

		this.context.clearRect(this.element.width, this.element.height)
		return this;
	}

	this.strokeRectangle = function(x, y, width, height){

		if(this.intuitiveY){

			y = this.a2iy(y);
			height = -height;
		}

		this.context.strokeRect(x, y, width, height);
	
		return this;
	}

	this.strokeRoundedRectangle = function(x, y, width, height, radius){

		var yradius = radius;
		var xradius = radius;

		if(this.intuitiveY){

			y = this.a2iy(y);
			height = -height;
		}
		if(height < 0){
			yradius = -yradius;
		}
		if(width < 0){
			xradius = -xradius;
		}


		this.context.beginPath();
		this.context.moveTo(x + xradius, y);
		this.context.lineTo(x + width - xradius, y);
		this.context.quadraticCurveTo(x + width, y, x + width, y + yradius);
		this.context.lineTo(x + width, y + height - yradius);
		this.context.quadraticCurveTo(x + width, y + height, x + width - xradius, y + height);
		this.context.lineTo(x + xradius, y + height);
		this.context.quadraticCurveTo(x, y + height, x, y + height - yradius);
		this.context.lineTo(x, y + yradius);
		this.context.quadraticCurveTo(x, y, x + xradius, y);
		this.context.closePath();
		this.context.stroke();

		return this;
	}

	this.strokeLine = function(x1, y1, x2, y2){

		if(this.intuitiveY){

			y1 = this.a2iy(y1);
			y2 = this.a2iy(y2);
		}

		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
		return this;
	}

	this.strokeCircle = function(x, y, r){

		if(this.intuitiveY){

			y = this.a2iy(y);
		}

		this.context.beginPath();
		this.context.arc(x, y, r, 0, 2*Math.PI);
		this.context.stroke();
		return this;
	}

	this.strokeOval = function(x, y, r, xfactor, yfactor){

		this.context.save();
		this.context.scale(xfactor, yfactor);
		this.strokeCircle(x, y, r)
		this.context.restore();

		return this;
	}

	this.strokeText = function(string, x, y){

		if(this.intuitiveY){

			y = this.a2iy(y);
		}
		
		this.context.strokeText(string, x, y, maxWidth);
		return this;
	}

	this.fillRectangle = function(x, y, width, height){

		if(this.intuitiveY){

			y = this.a2iy(y);
			height = -height;
		}

		this.context.fillRect(x, y, width, height);
		return this;
	}

	this.fillRoundedRectangle = function(x, y, width, height, radius){

		var yradius = radius;
		var xradius = radius;

		if(this.intuitiveY){

			y = this.a2iy(y);
			height = -height;
		}
		if(height < 0){
			yradius = -yradius;
		}
		if(width < 0){
			xradius = -xradius;
		}

		this.context.beginPath();
		this.context.moveTo(x + xradius, y);
		this.context.lineTo(x + width - xradius, y);
		this.context.quadraticCurveTo(x + width, y, x + width, y + yradius);
		this.context.lineTo(x + width, y + height - yradius);
		this.context.quadraticCurveTo(x + width, y + height, x + width - xradius, y + height);
		this.context.lineTo(x + xradius, y + height);
		this.context.quadraticCurveTo(x, y + height, x, y + height - yradius);
		this.context.lineTo(x, y + yradius);
		this.context.quadraticCurveTo(x, y, x + xradius, y);
		this.context.closePath();
		this.context.fill();

		return this;
	}

	this.fillLine = function(x1, y1, x2, y2){

		if(this.intuitiveY){

			y1 = this.a2iy(y1);
			y2 = this.a2iy(y2);
		}

		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.fill();
		return this;
	}

	this.fillCircle = function(x, y, r){

		if(this.intuitiveY){

			y = this.a2iy(y);
		}

		this.context.beginPath();
		this.context.arc(x, y, r, 0, 2*Math.PI);
		this.context.fill();
		return this;
	}

	this.fillOval = function(x, y, r, xfactor, yfactor){

		this.context.save();
		this.context.scale(xfactor, yfactor);
		this.fillCircle(x, y, r)
		this.context.restore();

		return this;
	}

	this.fillText = function(string, x, y){

		if(this.intuitiveY){

			y = this.a2iy(y);
		}

		this.context.fillText(string, x, y);
		return this;
	}

	this.drawImage = function(image, x, y, width, height){

		if(this.intuitiveY){

			y = this.a2iy(y);
			height = - height;
		}

		this.context.drawImage(image, x, y, width, height);
	}

	//Converts y coordinates from actual to intuitive
	this.a2iy = function(y_coordinate){

		return (- y_coordinate) + this.element.height
	}

	//Converts y coordinates from intuitive to actual
	this.i2ay = function(y_coordinate){

		return  - (y_coordinate - this.element.height)
	}

	//Edit a property in the context and return monadic style
	this.editContext = function(prop, style){

		this.context[prop] = style;
		return this;
	}

	//Apply a function to the context and return monadic style
	this.configure = function(func){

		func.apply(this, [this.context]);
		return this;
	}

	this.setContext("2d");
	this.setIntuitiveCoordinates("false")

	return this;
}

//Infrastructure

Instruction = function(f, a){

	this.f = f;
	this.a = a;

	this.activate = function(){
		return this.f.apply(this, this.a);
	}

	this.dmi = function(arg){
		this.a.push(arg);
		return this;
	}

	return this;
}
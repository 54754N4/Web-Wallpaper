//refs for title : https://flamingtext.com

var refresh = 35;
var matrix = "АБВГДЕЁЖЗИЙКЛМНОавгдеёжзийклмноПРСТУФХЦЧШЩЪЫЬЭЮЯпрстуфхцчшщъыьэюя".split("");
var font_size = 10;
var min_freq = 40;

var speed = 1;
var start = -(speed+1);

var drops = [];	

var prevW;
var prevH;

navigator.getUserMedia = navigator.getUserMedia 
	|| navigator.webkitGetUserMedia 
	|| navigator.mozGetUserMedia 
	|| null;

// Commands 
	
// Search

function handleKeyDown(event) {
	var input = document.getElementById("q").value;
	if (event.key == "Enter")
		if (!consume(input))
			window.location.replace(googlify(input));
}

function googlify(input) {
	return "http://www.google.com/search?q="+input;
}

function hideInput() {
	document.getElementById("q").style.display = "none";
}

function showInput() {
	document.getElementById("q").style.display = "block";
}

function hasGetUserMedia() {
     return !!(navigator.getUserMedia 
       || navigator.webkitGetUserMedia 
       || navigator.mozGetUserMedia 
       || navigator.msGetUserMedia);
}

// Matrix

function init() {
	"use strict";
	
	initCanvas();
	if (!hasGetUserMedia())  
		onError();
	else {
		//Audio stops listening in FF without window.persistAudioStream=stream; @https://bugzilla.mozilla.org/show_bug.cgi?id=965483 @https://support.mozilla.org/en-US/questions/984179
	    navigator.getUserMedia({audio:true}, audioMatrixify, onError);
	}
}

function initCanvas() {
	var c = document.getElementById("c");
	c.height = prevH = window.innerHeight;
	c.width = prevW = window.innerWidth;
	//init droplets	as big as possible then draw only as needed
	for(var i = 0; i < 1920/font_size; i++) 	//cause columns = window_width/font_size
		drops[i] = start;
}

function audioMatrixify(stream) {
	window.persistAudioStream = stream;
    var audioContent = new AudioContext();
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;
    var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
	
    var doDraw = function () {
    	var c = document.getElementById("c");
		c.height = window.innerHeight;
		c.width = window.innerWidth;
		var ctx = c.getContext("2d");
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";	//Black BG for the canvas, translucent BG to show trail
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#F00"; 				
        ctx.font = font_size + "px arial";
        
		//alert(frequencyArray+" "+allZero(frequencyArray));
        analyser.getByteFrequencyData(frequencyArray);	//request audio frequencies input into freq. array
        var droplets = window.innerWidth/font_size;
		for(var i = 0; i < droplets; i++) { 		//loop over drops
         	var soundLevel = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
            for (var j = 0; j < speed; j++) {
				var newChar = matrix[Math.floor(Math.random()*matrix.length)];  
				ctx.fillText(newChar, i*font_size, (drops[i]-j)*font_size);
			}
			
            if (drops[i]*font_size > c.height || soundLevel<min_freq)
                drops[i] = start;	  	//reset if we reached the bottom or we don't have sound for that freq
            else if (soundLevel>=min_freq)
				drops[i] += speed;      //increment drops Y coordinate to create animation effect only when specifc freq is there
    	}
    	requestAnimationFrame(doDraw);
    }
    requestAnimationFrame(doDraw);	//start animation cycle
}

function allZero(array) {
	for (var i in array) 
		if (i!=0)
			return false;
	return true;
}

function onError() {
	document.getElementById("logo").style.filter = "hue-rotate(150deg)";
	var animationTimer = setInterval(defaultDraw, 20);
}

function defaultDraw() {
	if (prevW != window.innerWidth)
		document.getElementById("c").width = window.innerWidth;
	if (prevH != window.innerHeight)
		document.getElementById("c").height = window.innerHeight;
	var ctx = c.getContext("2d"); 
	ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#0F0"; 
    ctx.font = font_size + "px arial";
	var droplets = window.innerWidth/font_size;
    for(var i = 0; i < droplets; i++) { 
        var text = matrix[Math.floor(Math.random()*matrix.length)];
        ctx.fillText(text, i*font_size, drops[i]*font_size);
        if(drops[i]*font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;
        drops[i]++;
    }
}

function cry(error) {
    alert(error);
    console.log(error);
}
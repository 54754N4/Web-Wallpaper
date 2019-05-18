//refs for title : https://flamingtext.com

var refresh = 35;
var matrix = "АБВГДЕЁЖЗИЙКЛМНОавгдеёжзийклмноПРСТУФХЦЧШЩЪЫЬЭЮЯпрстуфхцчшщъыьэюя".split("");
var font_size = 10;
var min_freq = 40;

var drop = [];
var dy = [];

navigator.getUserMedia = navigator.getUserMedia 
	|| navigator.webkitGetUserMedia 
	|| navigator.mozGetUserMedia 
	|| null;

function hasGetUserMedia() {
     return !!(navigator.getUserMedia 
       || navigator.webkitGetUserMedia 
       || navigator.mozGetUserMedia 
       || navigator.msGetUserMedia);
}

function handleKeyDown(event) {
	var input = document.getElementById("q").value;
	if (event.key == "Enter")
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
	//making the canvas full screen
	c.height = window.innerHeight;
	c.width = window.innerWidth;
	//init droplets
	for(var i = 0; i < (window.innerWidth/font_size); i++) {	//cause columns = window_width/font_size
		drop[i] = 0;
		dy[i] = 1;		//initially they all go down
	}
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
    	var ctx = c.getContext("2d");
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";	//Black BG for the canvas, translucent BG to show trail
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#F00"; 				
        ctx.font = font_size + "px arial";
        
        analyser.getByteFrequencyData(frequencyArray);	//request audio frequencies input into freq. array
    	for(var i = 0; i < drop.length; i++) { 		//loop over drop
         	var soundLevel = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
			if (soundLevel >= min_freq) {
				var newChar = matrix[Math.floor(Math.random()*matrix.length)];  
				ctx.fillText(newChar, i*font_size, drop[i]*font_size);
				drop[i]++;
			}

            if (drop[i]*font_size > c.height)
                drop[i] = 0;
    	}
    	requestAnimationFrame(doDraw);
    }
    requestAnimationFrame(doDraw);	//start animation cycle
}

function onError() {
	document.getElementById("logo").style.filter = "hue-rotate(150deg)";
	var animationTimer = setInterval(defaultDraw, 20);
}

function defaultDraw() {
	var ctx = c.getContext("2d"); 
	ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#0F0"; 
    ctx.font = font_size + "px arial";
    for(var i = 0; i < drop.length; i++) { 
        var text = matrix[Math.floor(Math.random()*matrix.length)];
        ctx.fillText(text, i*font_size, drop[i]*font_size);
        if(drop[i]*font_size > c.height && Math.random() > 0.975)
            drop[i] = 0;
        drop[i]++;
    }
}

function cry(error) {
    alert(error);
    console.log(error);
}
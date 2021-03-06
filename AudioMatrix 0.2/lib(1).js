//refs for title : https://flamingtext.com

var refresh = 35;
var matrix = "АБВГДЕЁЖЗИЙКЛМНОавгдеёжзийклмноПРСТУФХЦЧШЩЪЫЬЭЮЯпрстуфхцчшщъыьэюя".split("");
var font_size = 10;
var min_freq = 40;

navigator.getUserMedia =  navigator.getUserMedia 
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
	
	if (!hasGetUserMedia()) {
		alert('getUserMedia() is not supported in your browser');
		console.log("Browser doesn't support getUserMedia()");
	} else {
        var c = document.getElementById("c");
        //making the canvas full screen
        c.height = window.innerHeight;
        c.width = window.innerWidth;

        var drops = [];
        for(var i = 0; i < (window.innerWidth/font_size); i++) 	//cause columns = window_width/font_size
            drops[i] = 1;
		
		//Audio stops listening in FF without window.persistAudioStream=stream; @https://bugzilla.mozilla.org/show_bug.cgi?id=965483 @https://support.mozilla.org/en-US/questions/984179
        var soundAllowed = function(stream) {
	        window.persistAudioStream = stream;
	        var audioContent = new AudioContext();
	        var audioStream = audioContent.createMediaStreamSource(stream);
	        var analyser = audioContent.createAnalyser();
	        audioStream.connect(analyser);
	        analyser.fftSize = 1024;
	        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
	      
	        var doDraw = function () {
				requestAnimationFrame(doDraw);
	        	var ctx = c.getContext("2d");
		        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";	//Black BG for the canvas, translucent BG to show trail
		        ctx.fillRect(0, 0, c.width, c.height);
		        ctx.fillStyle = "#F00"; 				//For green text
		        ctx.font = font_size + "px arial";
	            
	            analyser.getByteFrequencyData(frequencyArray);	//request audio frequencies input into freq. array
	            for(var i = 0; i < drops.length; i++) { 		//loop over drops
	             	var soundLevel = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
	                var newChar = matrix[Math.floor(Math.random()*matrix.length)];  
	                ctx.fillText(newChar, i*font_size, drops[i]*font_size);

	                if(drops[i]*font_size > c.height && soundLevel>min_freq)
	                    drops[i] = 0;	  	//reset and make another drop only if soundLevel is above min frequency threshold
	                drops[i]++;             //always increment drops Y coordinate to create animation effect
            	}
	        }
	        doDraw();	//start animation cycle
	    }
	    navigator.getUserMedia({audio:true}, soundAllowed, cry);
	}
}

function cry(error) {
    alert("You must allow your microphone.");
    console.log(error);
}
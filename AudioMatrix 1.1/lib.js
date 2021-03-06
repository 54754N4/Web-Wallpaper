
var color = "F00";
var refresh = 35;
var matrix = "АБВГДЕЁЖЗИЙКЛМНОавгдеёжзийклмноПРСТУФХЦЧШЩЪЫЬЭЮЯпрстуфхцчшщъыьэюя".split("");
var font_size = 10;
var min_freq = 40;
var refresh_size = 500;
var max_width = 1920;
var file_path = "config.txt";

var randomize = false;
var matrix_colors = ["F00","FF0","0F0","0FF","00F","F0F"];
var logo_colors = [140,210,240,320,0,60];
var random_speed = 2000;

var drops = [];
var canvas;

var prev_color;
var prev_hue;
var color_timer;

// Search bar commands

var commands = {
	"search":
		function(input) {
			window.location.replace(googlify(input));
		},
	"mcol":
		function(c){
			colorize(c);
		},
	"lcol":
		function(angle) {
			prev_hue = angle;
			colorize_logo(angle);
		},
	"help":
		function(input) {
			print_help(input);
		},
	"random":
		function(state) {
			random(state);
		}
};

navigator.getUserMedia =  navigator.getUserMedia 
	|| navigator.webkitGetUserMedia 
	|| navigator.mozGetUserMedia 
	|| null;

// Functions

function init() {	//our main entry point too
	"use strict";

	canvas = document.getElementById("c");
	updateCanvasSize();
	colorize_logo(140);		//logo red

	//readConfig();		// for chrome and internet explorer can't do that
	
    for(var i = 0; i < max_width/font_size; i++)
        drops[i] = 1;

	if (!hasGetUserMedia())  
		onError();
	else {
		//Audio stops listening in FF without window.persistAudioStream=stream; @https://bugzilla.mozilla.org/show_bug.cgi?id=965483 @https://support.mozilla.org/en-US/questions/984179
	    navigator.getUserMedia({audio:true}, audioMatrixify, onError);
	}
}

function handleKeyDown(event) {
	var input = document.getElementById("q").value;
	if (event.key == "Enter")
		if (!consume(input)) 
			alert("unknown expression: "+input);
}

// Commands

function consume(input) {
	for (var name in commands) {
		if (input.startsWith(name)) {
			commands[name](remove_cmd_name(name, input));
			return true;
		}
	}
	return false;
}

function remove_cmd_name(name, input) {
	return input.substring(name.length, input.length).trim();
}

function add_command(name, lambda) {
	commands[name] = lambda;
}

// Helpers
	
function hasGetUserMedia() {
     return !!(navigator.getUserMedia 
       || navigator.webkitGetUserMedia 
       || navigator.mozGetUserMedia 
       || navigator.msGetUserMedia);
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

function updateCanvasSize() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
}

// Matrix

function audioMatrixify(stream) {
	window.persistAudioStream = stream;
    var audioContent = new AudioContext();
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;
    var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
  
    var doDraw = function () {
    	var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";	//Black BG for the canvas, translucent BG to show trail
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#"+color; 				
        ctx.font = font_size + "px arial";
        
        analyser.getByteFrequencyData(frequencyArray);	//request audio frequencies input into freq. array
        for(var i = 0; i < window.innerWidth/font_size; i++) { 		//loop over drops
         	var soundLevel = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
            var newChar = matrix[Math.floor(Math.random()*matrix.length)];  
            ctx.fillText(newChar, i*font_size, drops[i]*font_size);
			
			if (soundLevel<min_freq)
                drops[i]--;
            else //	if (soundLevel>=min_freq)
				drops[i]++;  
			
			if (drops[i]*font_size > c.height)
				drops[i] = 0;
			else if (drops[i]*font_size < 0)
				drops[i] = window.innerHeight;
    	}
		requestAnimationFrame(doDraw);
    }
    doDraw();	//start animation cycle	where requestAnimationFrame will take care of repeated calls
}

function defaultDraw() {
	var ctx = canvas.getContext("2d"); 
	ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#" + color; 
    ctx.font = font_size + "px arial";
    for(var i = 0; i < drops.length; i++) { 
        var text = matrix[Math.floor(Math.random()*matrix.length)];
        ctx.fillText(text, i*font_size, drops[i]*font_size);
        if(drops[i]*font_size > canvas.height && Math.random() > 0.975)
            drops[i] = 0;
        drops[i]++;
    }
	requestAnimationFrame(defaultDraw);
}

function onError() {
	defaultDraw();
}

function cry(error) {
    alert(error);
    console.log(error);
}

// File + Persistance

function readConfig() {
	readTextFile(file_path);
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                rawFile
					.responseText
					.match(/[^\r\n]+/g)		// split line by line
					.forEach(				
						function(item, index) {
							if (!consume(item))		// parse line
								alert("ERROR: "+item);
						}
					);
            }
        }
    }
    try {
    	rawFile.send(null);
    } catch (e) {
    	alert(e.message);
    }
}

// Command definitions

function colorize(c) {
	color = c;
}

function colorize_logo(angle) {
	document.getElementById("logo").style.filter = "hue-rotate("+angle+"deg)";	//refs for title : https://flamingtext.com
}

function print_help(input) {
	var help = "Available commands : ";
	for (var name in commands) 
		help += name + ", ";
	alert(help.substring(0, help.length-2));
}

function random(state) {
	if (state == "on" || state == "1") {
		prev_color = color;
		color_timer = setInterval(
			function() {	// make sure that new color is differnet than current 
				var rand;
				var new_col = color;
				while (new_col == color) {
					rand = Math.floor(Math.random()*matrix_colors.length);
					new_col = matrix_colors[rand];
				}
				color = new_col; 
				colorize_logo(logo_colors[rand]);
			}, 
			random_speed
		);
	} else if (state == "off" || state == "0") {
		clearInterval(color_timer);
		color = prev_color;
		colorize_logo(prev_hue);
	} else
		alert("You need to specify either on/off or 0/1 as parameter.");
}
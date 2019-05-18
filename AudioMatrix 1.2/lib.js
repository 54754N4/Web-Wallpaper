var refresh = 35;
var matrix = "АБВГДЕЁЖЗИЙКЛМНОавгдеёжзийклмноПРСТУФХЦЧШЩЪЫЬЭЮЯпрстуфхцчшщъыьэюя".split("");
var font_size = 10;
var min_freq = 40;
var refresh_size = 500;
var max_width = 1920;

var matrix_colors = ["FF0000","FFFF00","00FF00","00FFFF","0000FF","FF00FF"];
var logo_colors = [140,200,260,320,20,80];

var frame_count = 0;
var randomize = false;
var random_speed = 5;
var hue = 140;
var prev_hue = hue;
var hue_increment;
var color = "FF0000";
var prev_color = color;
var color_increment = ["010000", "000100", "000001"];
var target = 0;
var target_color;
var target_hue;

var drops = [];
var canvas;


// Search bar commands

var commands = {
	"discord":
		function(input) {
			sendWebhook(input);
		},
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
	|| navigator.mediaDevices.getUserMedia
	|| null;

// Functions

function init() {	//our main entry point too
	"use strict";
	
	colorize_logo(hue);
	canvas = document.getElementById("c");
	updateCanvasSize();
	
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
	document.getElementById("q").style.display = "inline";
}

function updateCanvasSize() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
}

function addHexColor(c1, c2) {
	var result = "";
	for (var i = 0; i < c1.length/2; i++) {
		var vector1 = c1.substr(i*2, (i+1)*2);
		var vector2 = c2.substr(i*2, (i+1)*2);
		result += hexColorVectorSum(vector1, vector2);
	}
	return result;
}

function hexColorVectorSum(h1, h2) {
	var sum = (parseInt(h1, 16) + parseInt(h2, 16))%0xFF;
	var str = sum.toString(16);
	while (str.length < 2) 
		str = '0' + str;
	return str.toUpperCase();
}

function colorAdd(c) {
	color = addHexColor(color, c);
}

function hueAdd(i) {
	hue = Math.round((hue + i)%360);
	colorize_logo(hue);
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
		frame_count++;
		if (randomize) 
			increaseColorDifferential();
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

function pad(hex) {
	var string = hex.toString(16);
	while (string.length < 2)
		string = '0' + string;
	return string;
}

function differential(color, target) {
	var diffs = [0,0,0,0,0,0];
	for (var i=0; i<color.length; i++) {
		var result = parseInt(target.charAt(i), 16) - parseInt(color.charAt(i), 16);
		if (result < 0) 
			diffs[i] = -1;
		else if(result > 0) 
			diffs[i] = 1;
	}
	return diffs;
}

function increaseColorDifferential() {
	if (frame_count>10000)
			frame_count = 0;
	if (frame_count%random_speed==0) {
		diffs = differential(color, target_color);
		var string = "";
		for (var i=0; i<diffs.length; i++)
			string += (parseInt(color[i], 16) + diffs[i]).toString(16);
		color = string;
		hueAdd(hue_increment);
		if (color.toLowerCase() == target_color.toLowerCase()) {
			//alert(hue+"="+target_hue+"\n"+color+"="+target_color);
			target++;
			if (target >= target_color.length)
				target = 0;
			target_color = matrix_colors[target];
			target_hue = logo_colors[target];
		}
	}
}

function defaultDraw() {
	frame_count++;
	if (randomize) 
		increaseColorDifferential();
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
		prev_hue = hue;
		randomize = true;
		target++;
		target_color = matrix_colors[target];
		target_hue = logo_colors[target];
		hue_increment = Math.abs(target_hue - hue)/16;
	} else if (state == "off" || state == "0") {
		randomize = false;
		color = prev_color;
		hue = prev_hue;
		colorize_logo(hue);
	} else 
		alert("You need to specify either on/off or 0/1 as parameter.");
}

function sendWebhook(message) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alert(xhttp.responseText);
		}
	};
	xhttp.open("POST", "https://discordapp.com/api/webhooks/570677545444442113/W1yZTKriuWqsaBE4ocKXQx6qhAOuKQXG1SraWCA-qwwYeLpajUjs_3B3i5GxLD68A9FJ", true);
	xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhttp.send(encodeURI("content="+message));
}
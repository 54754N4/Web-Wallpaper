

function sendWebhook(message) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alert(xhttp.responseText);
			// Typical action to be performed when the document is ready:
		}
	};
	xhttp.open("POST", "https://discordapp.com/api/webhooks/570677545444442113/W1yZTKriuWqsaBE4ocKXQx6qhAOuKQXG1SraWCA-qwwYeLpajUjs_3B3i5GxLD68A9FJ", true);
	xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhttp.send(encodeURI("content="+message));
}

function sendWebhookJSON(json1) {
	var json = {
	  "content": "Hello, World!",
	  "tts": false,
	  "embed": {
		"title": "Hello, Embed!",
		"description": "This is an embedded message."
	  }
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alert(xhttp.responseText);
			// Typical action to be performed when the document is ready:
		}
	};
	xhttp.open("POST", "https://discordapp.com/api/webhooks/570677545444442113/W1yZTKriuWqsaBE4ocKXQx6qhAOuKQXG1SraWCA-qwwYeLpajUjs_3B3i5GxLD68A9FJ", true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(json);
}

var commands = {};

function consume(input) {
	for (var name in commands) {
		if (input.startsWith(name)) {
			var args = remove_cmd_name(commands[name], input);
			commands[name](args);
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
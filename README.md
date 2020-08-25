# Web Wallpaper
Simple matrix web wallpaper. Requests microphone permissions on load which allows droplets to react based on sound. Otherwise, acts like a normal matrix.
Hovering over the logo pops up a search input bar for commands or googling.

![Wallpaper demo image failed to load...][demo]

# Instructions  
Hover over logo to get search input box.

![Input bar hover image failed to load...][input]

Type "help" then press enter if you want to know the available commands.
Examples :
1. mcol FF0000 	= make matrix color red (takes RGB input e.g. Green = 00FF00 or 0F0)
2. lcol 140    	= make logo color red, takes in an angle for hue-rotation
3. random 1		= make matrix transition colors randomly

Some Mainstream equivalents :
| Color   | Logo  | Matrix 
| ------- |:-----:| ------:
| RED     |  140  | F00 or FF0000 
| YELLOW  |  200  | FF0 or FFFF00
| GREEN   |  260  | 0F0  
| AQUA    |  320  | 0FF
| BLUE    |  20   | 00F
| PINK    |  80   | F0F

You can obviously use any hexadecimal color for the matrix in the form of RGB or RRGGBB, and the logo is based on the angle of a radial color pallete.

[demo]: https://github.com/54754N4/Web-Wallpaper/blob/master/demo.jpeg "Preview"
[input]: https://github.com/54754N4/Web-Wallpaper/blob/master/input.jpeg "Hover over logo to popup input box"

(function(global) {

global.Scheme = function(name, br, bg, bb, fr, fg, fb) {
	this.index = null;
	this.name = name.toUpperCase();
	this.br = br;
	this.bg = bg;
	this.bb = bb;
	this.fr = fr;
	this.fg = fg;
	this.fb = fb;
}

global.Scheme.shuffle = function() {
	var old = global.CURRENT_SCHEME;
	do global.CURRENT_SCHEME = global.SCHEMES[
		Math.floor(Math.random() * global.SCHEMES.length)
	]; while (global.CURRENT_SCHEME == old);
};

global.CURRENT_SCHEME = null;

global.SCHEMES = [
	new global.Scheme('black', 77, 77, 77, 0, 0, 0),
	new global.Scheme('brick', 195, 77, 77, 0, 0, 0),
	new global.Scheme('crimson', 254, 77, 77, 57, 0, 0),
	new global.Scheme('red', 254, 77, 77, 177, 0, 0),
	new global.Scheme('turtle', 77, 195, 77, 0, 0, 0),
	new global.Scheme('sludge', 195, 195, 77, 0, 0, 0),
	new global.Scheme('brown', 254, 195, 77, 57, 0, 0),
	new global.Scheme('orange', 254, 195, 77, 177, 0, 0),
	new global.Scheme('green', 77, 254, 77, 0, 57, 0),
	new global.Scheme('grass', 195, 254, 77, 0, 57, 0),
	new global.Scheme('maize', 254, 254, 77, 57, 57, 0),
	new global.Scheme('citrus', 254, 254, 77, 177, 57, 0),
	new global.Scheme('lime', 77, 254, 77, 0, 177, 0),
	new global.Scheme('leaf', 195, 254, 77, 0, 177, 0),
	new global.Scheme('chartreuse', 254, 254, 77, 57, 177, 0),
	new global.Scheme('yellow', 254, 254, 77, 177, 177, 0),
	new global.Scheme('midnight', 77, 77, 195, 0, 0, 0),
	new global.Scheme('plum', 195, 77, 195, 0, 0, 0),
	new global.Scheme('pomegranate', 254, 77, 195, 57, 0, 0),
	new global.Scheme('rose', 254, 77, 195, 177, 0, 0),
	new global.Scheme('swamp', 77, 195, 195, 0, 0, 0),
	new global.Scheme('dust', 195, 195, 195, 0, 0, 0),
	new global.Scheme('dirt', 254, 195, 195, 57, 0, 0),
	new global.Scheme('blossom', 254, 195, 195, 177, 0, 0),
	new global.Scheme('sea', 77, 254, 195, 0, 57, 0),
	new global.Scheme('ill', 195, 254, 195, 0, 57, 0),
	new global.Scheme('haze', 254, 254, 195, 57, 57, 0),
	new global.Scheme('peach', 254, 254, 195, 177, 57, 0),
	new global.Scheme('spring', 77, 254, 195, 0, 177, 0),
	new global.Scheme('mantis', 195, 254, 195, 0, 177, 0),
	new global.Scheme('brilliant', 254, 254, 195, 57, 177, 0),
	new global.Scheme('canary', 254, 254, 195, 177, 177, 0),
	new global.Scheme('navy', 77, 77, 254, 0, 0, 57),
	new global.Scheme('grape', 195, 77, 254, 0, 0, 57),
	new global.Scheme('mauve', 254, 77, 254, 57, 0, 57),
	new global.Scheme('purple', 254, 77, 254, 177, 0, 57),
	new global.Scheme('cornflower', 77, 195, 254, 0, 0, 57),
	new global.Scheme('deep', 195, 195, 254, 0, 0, 57),
	new global.Scheme('lilac', 254, 195, 254, 57, 0, 57),
	new global.Scheme('lavender', 254, 195, 254, 177, 0, 57),
	new global.Scheme('aqua', 77, 254, 254, 0, 57, 57),
	new global.Scheme('steel', 195, 254, 254, 0, 57, 57),
	new global.Scheme('grey', 254, 254, 254, 57, 57, 57),
	new global.Scheme('pink', 254, 254, 254, 177, 57, 57),
	new global.Scheme('bay', 77, 254, 254, 0, 177, 57),
	new global.Scheme('marina', 195, 254, 254, 0, 177, 57),
	new global.Scheme('tornado', 254, 254, 254, 57, 177, 57),
	new global.Scheme('saltine', 254, 254, 254, 177, 177, 57),
	new global.Scheme('blue', 77, 77, 254, 0, 0, 177),
	new global.Scheme('twilight', 195, 77, 254, 0, 0, 177),
	new global.Scheme('orchid', 254, 77, 254, 57, 0, 177),
	new global.Scheme('magenta', 254, 77, 254, 177, 0, 177),
	new global.Scheme('azure', 77, 195, 254, 0, 0, 177),
	new global.Scheme('liberty', 195, 195, 254, 0, 0, 177),
	new global.Scheme('royalty', 254, 195, 254, 57, 0, 177),
	new global.Scheme('thistle', 254, 195, 254, 177, 0, 177),
	new global.Scheme('ocean', 77, 254, 254, 0, 57, 177),
	new global.Scheme('sky', 195, 254, 254, 0, 57, 177),
	new global.Scheme('periwinkle', 254, 254, 254, 57, 57, 177),
	new global.Scheme('carnation', 254, 254, 254, 177, 57, 177),
	new global.Scheme('cyan', 77, 254, 254, 0, 177, 177),
	new global.Scheme('turquoise', 195, 254, 254, 0, 177, 177),
	new global.Scheme('powder', 254, 254, 254, 57, 177, 177),
	new global.Scheme('white', 254, 254, 254, 177, 177, 177),
];

global.SCHEMES.forEach(function(scheme, i) {
	scheme.index = i;
});

})(this);

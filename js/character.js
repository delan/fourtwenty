(function(global) {

global.Character = function(name, filename, width, height) {
	this.index = null;
	this.name = name;
	this.filename = 'img/' + filename;
	this.width = width;
	this.height = height;
	this.image_element = null;
	this.image_data = null;
};

global.Character.resize = function(width, height) {
	CHARACTERS.forEach(function(character) {
		character.cache(width, height);
	});
};

global.Character.shuffle = function() {
	var old = global.CURRENT_CHARACTER;
	do global.CURRENT_CHARACTER = global.CHARACTERS[
		Math.floor(Math.random() * global.CHARACTERS.length)
	]; while (global.CURRENT_CHARACTER == old);
};

global.Character.prototype.cache = function(output_width, output_height) {
	var input_aspect = this.width / this.height;
	var output_aspect = output_width / output_height;
	SCRATCH_CANVAS.width = output_width;
	SCRATCH_CANVAS.height = output_height;
	SCRATCH_CONTEXT.clearRect(0, 0, output_width, output_height);
	if (input_aspect > output_aspect) {
		var new_width = this.height * output_aspect;
		SCRATCH_CONTEXT.drawImage(
			this.image_element,
			(this.width - new_width) / 2, 0,
			new_width, this.height,
			0, 0, output_width, output_height
		);
	} else {
		var new_height = this.width / output_aspect;
		SCRATCH_CONTEXT.drawImage(
			this.image_element,
			0, (this.height - new_height) / 2,
			this.width, new_height,
			0, 0, output_width, output_height
		);
	}
	this.image_data = SCRATCH_CONTEXT.getImageData(
		0, 0, output_width, output_height
	);
};

global.Character.prototype.draw = function(timestamp, context, scheme) {
	var w = context.canvas.width;
	var h = context.canvas.height;
	var p = this.image_data;
	var q = context.getImageData(0, 0, w, h);
	var fr = scheme.fr;
	var fg = scheme.fg;
	var fb = scheme.fb;
	var br = scheme.br;
	var bg = scheme.bg;
	var bb = scheme.bb;
	var increment = CURRENT_CHARACTER_BLUR_DIRECTION ? w : 1;
	var n = 0;
	var r = 0;
	var g = 0;
	var b = 0;
	var i = 0;
	var j = 0;
	var x = 0;
	var y = 0;
	var missed = 0;
	var border_axis = 0;
	var border_limit = CURRENT_CHARACTER_BLUR_DIRECTION ? h : w;
	var animation_fraction = (
		timestamp - CURRENT_CHARACTER_BLUR_TIMESTAMP
	) / 200;
	if (0 < animation_fraction && animation_fraction < 1)
		n = ((w / 20) * (1 - animation_fraction)) | 0;
	for (y = 0; y < h; y++) {
		for (x = 0; x < w; x++) {
			i = 4 * (w * y + x);
			r = 0;
			g = 0;
			b = 0;
			missed = 0;
			for (j = -n; j <= n; j++) {
				if (CURRENT_CHARACTER_BLUR_DIRECTION)
					border_axis = y;
				else
					border_axis = x;
				if (
					border_axis + j < 0 ||
					border_axis + j >= border_limit
				) {
					missed++;
				} else if (
					p.data[i + 3 + 4 * increment * j] >
					127
				) {
					r += fr;
					g += fg;
					b += fb;
				} else {
					r += br;
					g += bg;
					b += bb;
				}
			}
			q.data[i + 0] = r / (2 * n + 1 - missed);
			q.data[i + 1] = g / (2 * n + 1 - missed);
			q.data[i + 2] = b / (2 * n + 1 - missed);
			q.data[i + 3] = 255;
		}
	}
	context.putImageData(q, 0, 0);
};

var SCRATCH_CANVAS = document.createElement('canvas');
var SCRATCH_CONTEXT = SCRATCH_CANVAS.getContext('2d');

global.CURRENT_CHARACTER = null;
global.CURRENT_CHARACTER_BLUR_TIMESTAMP = null;
// [false, true] = [horizontal blur, vertical blur]
global.CURRENT_CHARACTER_BLUR_DIRECTION = true;

global.CHARACTERS = [
	new global.Character('HANAKO', 'bitmap88.png', 1280, 720),
	new global.Character('HOLO', 'bitmap89.png', 1280, 720),
	new global.Character('AKARIN', 'bitmap93.png', 1280, 720),
	new global.Character('LUCY', 'bitmap97.png', 1280, 720),
	new global.Character('ASTRAEA', 'bitmap98.png', 1280, 720),
	new global.Character('MISAKI', 'bitmap99.png', 1280, 720),
	new global.Character('RENGE', 'bitmap101.png', 1280, 720),
	new global.Character('MIRAI', 'bitmap102.png', 1280, 720),
	new global.Character('LALA-RU', 'bitmap103.png', 1280, 720),
	new global.Character('NYMPH', 'bitmap105.png', 1280, 720),
	new global.Character('MADOTSUKI', 'bitmap108.png', 1280, 720),
	new global.Character('MAYOI', 'bitmap109.png', 1280, 720),
	new global.Character('CIRNO', 'bitmap113.png', 1280, 720),
	new global.Character('AGIRI', 'bitmap114.png', 1280, 720),
	new global.Character('NOEL', 'bitmap115.png', 1280, 720),
	new global.Character('HARUHI', 'bitmap116.png', 1280, 720),
	new global.Character('MAO', 'bitmap117.png', 1280, 720),
	new global.Character('EUREKA', 'bitmap118.png', 1280, 720),
	new global.Character('KYOKO', 'bitmap119.png', 1280, 720),
	new global.Character('MEGUMI', 'bitmap124.png', 1280, 720),
	new global.Character('KANOE', 'bitmap125.png', 1280, 720),
	new global.Character('FUU', 'bitmap126.png', 1280, 720),
	new global.Character('SUISEISEKI', 'bitmap127.png', 1280, 720),
	new global.Character('AYASE', 'bitmap128.png', 1280, 720),
];

global.CHARACTERS.forEach(function(character, i) {
	character.index = i;
});

})(this);

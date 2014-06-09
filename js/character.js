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
	SCRATCH_BLUR_DATA = SCRATCH_CONTEXT.createImageData(width, height);
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

global.Character.blur_x = function(input_data, output_data, intensity) {
	var w = input_data.width;
	var h = input_data.height;
	var p = input_data.data;
	var q = output_data.data;
	var n = intensity;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = 4 * (input_data.width * y + x);
			var r = 0;
			var g = 0;
			var b = 0;
			var a = 0;
			var missed = 0;
			for (var j = -n; j <= n; j++) {
				if (x + j < 0 || x + j >= w) {
					missed++;
				} else {
					r += p[i + 0 + 4 * j];
					g += p[i + 1 + 4 * j];
					b += p[i + 2 + 4 * j];
					a += p[i + 3 + 4 * j];
				}
			}
			q[i + 0] = r / (2 * n + 1 - missed);
			q[i + 1] = g / (2 * n + 1 - missed);
			q[i + 2] = b / (2 * n + 1 - missed);
			q[i + 3] = a / (2 * n + 1 - missed);
		}
	}
};

global.Character.blur_y = function(input_data, output_data, intensity) {
	var w = input_data.width;
	var h = input_data.height;
	var p = input_data.data;
	var q = output_data.data;
	var n = intensity;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = 4 * (input_data.width * y + x);
			var r = 0;
			var g = 0;
			var b = 0;
			var a = 0;
			var missed = 0;
			for (var j = -n; j <= n; j++) {
				if (y + j < 0 || y + j >= h) {
					missed++;
				} else {
					r += p[i + 0 + 4 * w * j];
					g += p[i + 1 + 4 * w * j];
					b += p[i + 2 + 4 * w * j];
					a += p[i + 3 + 4 * w * j];
				}
			}
			q[i + 0] = r / (2 * n + 1 - missed);
			q[i + 1] = g / (2 * n + 1 - missed);
			q[i + 2] = b / (2 * n + 1 - missed);
			q[i + 3] = a / (2 * n + 1 - missed);
		}
	}
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
	var x = this.image_data;
	var y = context.getImageData(0, 0, w, h);
	var z = SCRATCH_BLUR_DATA;
	var fr = scheme.fr;
	var fg = scheme.fg;
	var fb = scheme.fb;
	var br = scheme.br;
	var bg = scheme.bg;
	var bb = scheme.bb;
	for (var i = 0; i < w * h; i++) {
		if (x.data[4 * i + 3] > 127) {
			y.data[4 * i + 0] = fr;
			y.data[4 * i + 1] = fg;
			y.data[4 * i + 2] = fb;
			y.data[4 * i + 3] = 255;
		} else {
			y.data[4 * i + 0] = br;
			y.data[4 * i + 1] = bg;
			y.data[4 * i + 2] = bb;
			y.data[4 * i + 3] = 255;
		}
	}
	if (CURRENT_CHARACTER_BLUR_TIMESTAMP) {
		var animation_fraction = (
			timestamp - CURRENT_CHARACTER_BLUR_TIMESTAMP
		) / 160;
		if (0 < animation_fraction && animation_fraction < 1) {
			var p = w / 10;
			var n = (p - animation_fraction * p) | 0;
			if (global.CURRENT_CHARACTER_BLUR_DIRECTION)
				Character.blur_y(y, z, n);
			else
				Character.blur_x(y, z, n);
			y = z;
		}
	}
	context.putImageData(y, 0, 0);
};

var SCRATCH_CANVAS = document.createElement('canvas');
var SCRATCH_CONTEXT = SCRATCH_CANVAS.getContext('2d');
var SCRATCH_BLUR_DATA;

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

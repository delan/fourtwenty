(function(global) {

// TODO: this entire file is disgusting

function Scheme(name, br, bg, bb, fr, fg, fb) {
	this.name = name.toUpperCase();
	this.br = br;
	this.bg = bg;
	this.bb = bb;
	this.fr = fr;
	this.fg = fg;
	this.fb = fb;
}

function Character(name, filename, width, height) {
	this.name = name;
	this.filename = 'images/' + filename;
	this.width = width;
	this.height = height;
}

function Song(name, rhythm) {
	this.name = name;
	this.rhythm = rhythm;
}

var READY = false;

var CANVAS = document.getElementById('canvas');
var CONTEXT = CANVAS.getContext('2d');
var WIDTH = global.innerWidth;
var HEIGHT = global.innerHeight;

var SONG = 'RESTOFMYLIF';
var TIME;
var FPS;

var TIMER_FPS;
var TIMER_BEAT;
var DELAY_BEAT = 150; // TODO

var RHYTHM_LEFT;
var RHYTHM_RIGHT;

var CHARACTER_CANVAS = document.createElement('canvas');
var CHARACTER_CONTEXT = CHARACTER_CANVAS.getContext('2d');
var CHARACTER_IMAGE = [];
var CHARACTER_DATA;
var CHARACTER_CACHE;

var B = 0x00;
var C;
var I;
var T = 0x0000;
var V = 0x64;
var X = 0x00;
var Y = 0x00;

var SCHEMES = [
        new Scheme('black', 77, 77, 77, 0, 0, 0),
        new Scheme('brick', 195, 77, 77, 0, 0, 0),
        new Scheme('crimson', 254, 77, 77, 57, 0, 0),
        new Scheme('red', 254, 77, 77, 177, 0, 0),
        new Scheme('turtle', 77, 195, 77, 0, 0, 0),
        new Scheme('sludge', 195, 195, 77, 0, 0, 0),
        new Scheme('brown', 254, 195, 77, 57, 0, 0),
        new Scheme('orange', 254, 195, 77, 177, 0, 0),
        new Scheme('green', 77, 254, 77, 0, 57, 0),
        new Scheme('grass', 195, 254, 77, 0, 57, 0),
        new Scheme('maize', 254, 254, 77, 57, 57, 0),
        new Scheme('citrus', 254, 254, 77, 177, 57, 0),
        new Scheme('lime', 77, 254, 77, 0, 177, 0),
        new Scheme('leaf', 195, 254, 77, 0, 177, 0),
        new Scheme('chartreuse', 254, 254, 77, 57, 177, 0),
        new Scheme('yellow', 254, 254, 77, 177, 177, 0),
        new Scheme('midnight', 77, 77, 195, 0, 0, 0),
        new Scheme('plum', 195, 77, 195, 0, 0, 0),
        new Scheme('pomegranate', 254, 77, 195, 57, 0, 0),
        new Scheme('rose', 254, 77, 195, 177, 0, 0),
        new Scheme('swamp', 77, 195, 195, 0, 0, 0),
        new Scheme('dust', 195, 195, 195, 0, 0, 0),
        new Scheme('dirt', 254, 195, 195, 57, 0, 0),
        new Scheme('blossom', 254, 195, 195, 177, 0, 0),
        new Scheme('sea', 77, 254, 195, 0, 57, 0),
        new Scheme('ill', 195, 254, 195, 0, 57, 0),
        new Scheme('haze', 254, 254, 195, 57, 57, 0),
        new Scheme('peach', 254, 254, 195, 177, 57, 0),
        new Scheme('spring', 77, 254, 195, 0, 177, 0),
        new Scheme('mantis', 195, 254, 195, 0, 177, 0),
        new Scheme('brilliant', 254, 254, 195, 57, 177, 0),
        new Scheme('canary', 254, 254, 195, 177, 177, 0),
        new Scheme('navy', 77, 77, 254, 0, 0, 57),
        new Scheme('grape', 195, 77, 254, 0, 0, 57),
        new Scheme('mauve', 254, 77, 254, 57, 0, 57),
        new Scheme('purple', 254, 77, 254, 177, 0, 57),
        new Scheme('cornflower', 77, 195, 254, 0, 0, 57),
        new Scheme('deep', 195, 195, 254, 0, 0, 57),
        new Scheme('lilac', 254, 195, 254, 57, 0, 57),
        new Scheme('lavender', 254, 195, 254, 177, 0, 57),
        new Scheme('aqua', 77, 254, 254, 0, 57, 57),
        new Scheme('steel', 195, 254, 254, 0, 57, 57),
        new Scheme('grey', 254, 254, 254, 57, 57, 57),
        new Scheme('pink', 254, 254, 254, 177, 57, 57),
        new Scheme('bay', 77, 254, 254, 0, 177, 57),
        new Scheme('marina', 195, 254, 254, 0, 177, 57),
        new Scheme('tornado', 254, 254, 254, 57, 177, 57),
        /* TODO: what is saltine? */,
        new Scheme('blue', 77, 77, 254, 0, 0, 177),
        new Scheme('twilight', 195, 77, 254, 0, 0, 177),
        new Scheme('orchid', 254, 77, 254, 57, 0, 177),
        new Scheme('magenta', 254, 77, 254, 177, 0, 177),
        new Scheme('azure', 77, 195, 254, 0, 0, 177),
        new Scheme('liberty', 195, 195, 254, 0, 0, 177),
        new Scheme('royalty', 254, 195, 254, 57, 0, 177),
        new Scheme('thistle', 254, 195, 254, 177, 0, 177),
        new Scheme('ocean', 77, 254, 254, 0, 57, 177),
        new Scheme('sky', 195, 254, 254, 0, 57, 177),
        new Scheme('periwinkle', 254, 254, 254, 57, 57, 177),
        new Scheme('carnation', 254, 254, 254, 177, 57, 177),
        new Scheme('cyan', 77, 254, 254, 0, 177, 177),
        new Scheme('turquoise', 195, 254, 254, 0, 177, 177),
        new Scheme('powder', 254, 254, 254, 57, 177, 177),
        new Scheme('white', 254, 254, 254, 177, 177, 177),
];

var CHARACTERS = [
	new Character('HANAKO', 'bitmap88.png', 1280, 720),
	new Character('HOLO', 'bitmap89.png', 1280, 720),
	new Character('AKARIN', 'bitmap93.png', 1280, 720),
	new Character('LUCY', 'bitmap97.png', 1280, 720),
	new Character('ASTRAEA', 'bitmap98.png', 1280, 720),
	new Character('MISAKI', 'bitmap99.png', 1280, 720),
	new Character('RENGE', 'bitmap101.png', 1280, 720),
	new Character('MIRAI', 'bitmap102.png', 1280, 720),
	new Character('LALA-RU', 'bitmap103.png', 1280, 720),
	new Character('NYMPH', 'bitmap105.png', 1280, 720),
	new Character('MADOTSUKI', 'bitmap108.png', 1280, 720),
	new Character('MAYOI', 'bitmap109.png', 1280, 720),
	new Character('CIRNO', 'bitmap113.png', 1280, 720),
	new Character('AGIRI', 'bitmap114.png', 1280, 720),
	new Character('NOEL', 'bitmap115.png', 1280, 720),
	new Character('HARUHI', 'bitmap116.png', 1280, 720),
	new Character('MAO', 'bitmap117.png', 1280, 720),
	new Character('EUREKA', 'bitmap118.png', 1280, 720),
	new Character('KYOKO', 'bitmap119.png', 1280, 720),
	new Character('MEGUMI', 'bitmap124.png', 1280, 720),
	new Character('KANOE', 'bitmap125.png', 1280, 720),
	new Character('FUU', 'bitmap126.png', 1280, 720),
	new Character('SUISEISEKI', 'bitmap127.png', 1280, 720),
	new Character('AYASE', 'bitmap128.png', 1280, 720),
];

var SONGS = [
	// TODO: implement audio
	new Song('RESTOFMYLIF',
		'x..o..x......o.x..o.x....xo...o..x.....o' +
		'..x..ox.....xo..o..x......o.x....x....xo' +
		'...o..x......o.x..ox.....xo..o...x.....o' +
		'..x..ox.....xo..o..x......o.x..o.x....xo' +
		'...o..x......o.x..ox.....xo..o...x....xo' +
		'.x...ox.xx.x.'
	),
	// TODO: add all songs to this array
];

// TODO: this is disgusting
var CHARACTER_MAP = {};
var SONG_MAP = {};

function hex(number, digits) {
	var prefix = '$0x';
	var body = parseInt(number.toString()).toString(16);
	var length = digits + 1 - body.length;
	var padding = length > 0 ? Array(length).join('0') : '';
	return prefix + padding + body;
}

function load() {
	resize();
	function load_image(i) {
		var img = CHARACTER_IMAGE[i] = document.createElement('img');
		img.onload = function() {
			CONTEXT.font = '24pt Commodore';
			CONTEXT.textAlign = 'left';
			CONTEXT.fillText(
				'loading' + Array(i + 2).join('.'),
				20, 60
			);
			if (++i < CHARACTERS.length)
				load_image(i);
			else
				start();
		};
		img.src = CHARACTERS[i].filename;
	}
	load_image(0);
}

function start() {
	READY = true;
	resize();
	change_scheme();
	change_character();
	CHARACTERS.forEach(function(c) {
		CHARACTER_MAP[c.name] = c;
	});
	SONGS.forEach(function(s) {
		SONG_MAP[s.name] = s;
	});
	RHYTHM_LEFT = SONG_MAP[SONG].rhythm.split('').reverse().join('');
	RHYTHM_RIGHT = SONG_MAP[SONG].rhythm;
	requestAnimationFrame(frame);
	TIMER_BEAT = setInterval(beat, DELAY_BEAT);
	TIMER_FPS = setInterval(poll_fps, 1000);
}

function frame() {
	T++;
	TIME = +new Date;
	draw_clear();
	draw_character();
	draw_status();
	draw_rhythm();
	requestAnimationFrame(frame);
}

function draw_clear() {
	CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw_character() {
	var x = CHARACTER_CACHE[I];
	var y = CHARACTER_DATA;
	var fr = SCHEMES[C].fr;
	var fg = SCHEMES[C].fg;
	var fb = SCHEMES[C].fb;
	var br = SCHEMES[C].br;
	var bg = SCHEMES[C].bg;
	var bb = SCHEMES[C].bb;
	for (var i = 0; i < WIDTH * HEIGHT; i++) {
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
	CONTEXT.putImageData(y, 0, 0);
}

function draw_status() {
	CONTEXT.font = '6pt Commodore';
	CONTEXT.textAlign = 'left';
	[
		SONG, // song name
		SCHEMES[C].name, // colour scheme name
		'V=' + hex(V, 2), // always seems to be the same? version?
		'C=' + hex(C, 2), // colour scheme index
		'Y=' + hex(Y, 2), // vertical blur intensity
		'X=' + hex(X, 2), // horizontal blur intensity
		'B=' + hex(B, 2), // beats since song start
		'T=' + hex(T, 4), // frames since song start?
		'I=' + I, // character
		'M=FULL AUTO', // character cycling mode,
		FPS + ' Hz',
	].forEach(function(s, i) {
		CONTEXT.fillText(s, 4, HEIGHT - 10 * i - 10);
	});
}

function draw_rhythm() {
	CONTEXT.font = '12pt Commodore';
	CONTEXT.textAlign = 'left';
	CONTEXT.fillText(RHYTHM_RIGHT, WIDTH / 2 + 2, 16);
	CONTEXT.textAlign = 'right';
	CONTEXT.fillText(RHYTHM_LEFT, WIDTH / 2 - 2, 16);
}

function beat() {
	B++;
	RHYTHM_LEFT =
		RHYTHM_LEFT[RHYTHM_LEFT.length - 1] +
		RHYTHM_LEFT.substr(0, RHYTHM_LEFT.length - 1);
	RHYTHM_RIGHT =
		RHYTHM_RIGHT.substr(1, RHYTHM_RIGHT.length - 1) +
		RHYTHM_RIGHT[0];
	var next = RHYTHM_RIGHT[0];
	switch (next) {
	case 'x':
	case 'o':
		change_scheme();
		change_character();
		break;
	default:
		break;
	}
}

function change_scheme() {
	var old = C;
	do C = Math.floor(Math.random() * SCHEMES.length);
	while (C == old || SCHEMES[C].fb == undefined);
}

function change_character() {
	var old = I;
	do I = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].name;
	while (I == old);
}

function poll_fps() {
	FPS = T - poll_fps.last;
	poll_fps.last = T;
}

function resize() {
	WIDTH = global.innerWidth;
	HEIGHT = global.innerHeight;
	CANVAS.width = WIDTH;
	CANVAS.height = HEIGHT;
	CHARACTER_CANVAS.width = WIDTH;
	CHARACTER_CANVAS.height = HEIGHT;
	CHARACTER_DATA = CHARACTER_CONTEXT.getImageData(0, 0, WIDTH, HEIGHT);
	CHARACTER_CACHE = {};
	if (READY)
		CHARACTERS.forEach(cache_character);
}

function cache_character(character_object, i) {
	var input_width = character_object.width;
	var input_height = character_object.height;
	var input_aspect = input_width / input_height;
	var output_width = WIDTH;
	var output_height = HEIGHT;
	var output_aspect = output_width / output_height;
	CHARACTER_CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);
	if (input_aspect > output_aspect) {
		var new_width = input_height * output_aspect;
		CHARACTER_CONTEXT.drawImage(
			CHARACTER_IMAGE[i],
			(input_width - new_width) / 2,
			0, new_width, input_height,
			0, 0, output_width, output_height
		);
	} else {
		var new_height = input_width / output_aspect;
		CHARACTER_CONTEXT.drawImage(
			CHARACTER_IMAGE[i], 0,
			(input_height - new_height) / 2,
			input_width, new_height,
			0, 0, output_width, output_height
		);
	}
	CHARACTER_CACHE[character_object.name] = CHARACTER_CONTEXT.
		getImageData(0, 0, WIDTH, HEIGHT);
}

global.onload = load;
global.onresize = resize;

})(this);

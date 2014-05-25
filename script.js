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
var CHARACTER_IMAGE = document.createElement('img');
var CHARACTER_DATA;
var CHARACTER_CACHE;

var B = 0x00;
var C = 0x1E;
var I = 'HANAKO';
var T = 0x0000;

var SCHEMES = [
	// TODO: fill in all colour schemes
	new Scheme('black'),
	new Scheme('brick'),
	new Scheme('crimson'),
	new Scheme('red'),
	new Scheme('turtle'),
	new Scheme('sludge'),
	new Scheme('brown'),
	new Scheme('orange'),
	new Scheme('green'),
	new Scheme('grass'),
	new Scheme('maize', 254, 254, 77, 57, 57, 0),
	new Scheme('citrus', 254, 254, 77, 177, 57, 0),
	new Scheme('lime'),
	new Scheme('leaf'),
	new Scheme('chartreuse'),
	new Scheme('yellow'),
	new Scheme('midnight'),
	new Scheme('plum'),
	new Scheme('pomegranate'),
	new Scheme('rose'),
	new Scheme('swamp'),
	new Scheme('dust'),
	new Scheme('dirt'),
	new Scheme('blossom'),
	new Scheme('sea'),
	new Scheme('ill'),
	new Scheme('haze'),
	new Scheme('peach'),
	new Scheme('spring'),
	new Scheme('mantis'),
	new Scheme('brilliant', 254, 254, 195, 57, 177, 0),
	new Scheme('canary', 254, 254, 195, 177, 177, 0),
	new Scheme('navy'),
	new Scheme('grape'),
	new Scheme('mauve'),
	new Scheme('purple', 254, 77, 254, 177, 0, 57),
	new Scheme('cornflower'),
	new Scheme('deep'),
	new Scheme('lilac'),
	new Scheme('lavender'),
	new Scheme('aqua'),
	new Scheme('steel'),
	new Scheme('grey'),
	new Scheme('pink'),
	new Scheme('bay'),
	new Scheme('marina'),
	new Scheme('tornado'),
	new Scheme('saltine'),
	new Scheme('blue'),
	new Scheme('twilight', 195, 77, 254, 0, 0, 177),
	new Scheme('orchid'),
	new Scheme('magenta'),
	new Scheme('azure'),
	new Scheme('liberty'),
	new Scheme('royalty'),
	new Scheme('thistle'),
	new Scheme('ocean'),
	new Scheme('sky'),
	new Scheme('periwinkle'),
	new Scheme('carnation'),
	new Scheme('cyan'),
	new Scheme('turquoise'),
	new Scheme('powder'),
	new Scheme('white'),
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

function start() {
	CHARACTERS.forEach(function(c) {
		CHARACTER_MAP[c.name] = c;
	});
	SONGS.forEach(function(s) {
		SONG_MAP[s.name] = s;
	});
	resize();
	requestAnimationFrame(frame);
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
	if (CHARACTER_CACHE[I]) {
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
}

function draw_status() {
	CONTEXT.font = '6pt Commodore';
	CONTEXT.textAlign = 'left';
	[
		SONG, // song name
		SCHEMES[C].name, // colour scheme name
		'V=$0x64', // always seems to be the same? version?
		'C=' + hex(C, 2), // colour scheme index
		'Y=$0x00', // vertical shimmer offset
		'X=$0x00', // horizontal shimmer offset
		'B=' + hex(B, 2), // beats since song start
		'T=' + hex(T, 4), // frames since song start?
		'I=' + I, // character
		'M=FULL AUTO', // character cycling mode,
		'',
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
	// TODO: refactor the fuck out of this ugly function
	if (!RHYTHM_LEFT) {
		var input_rhythm = SONG_MAP[SONG].rhythm;
		RHYTHM_LEFT = input_rhythm.split('').reverse().join('');
		RHYTHM_RIGHT = input_rhythm;
	} else {
		RHYTHM_LEFT =
			RHYTHM_LEFT[RHYTHM_LEFT.length - 1] +
			RHYTHM_LEFT.substr(0, RHYTHM_LEFT.length - 1);
		RHYTHM_RIGHT =
			RHYTHM_RIGHT.substr(1, RHYTHM_RIGHT.length - 1) +
			RHYTHM_RIGHT[0];
	}
	var next = RHYTHM_RIGHT[0];
	switch (next) {
	case 'x':
	case 'o':
		change_colour();
		change_character();
		break;
	default:
		break;
	}
}

function change_colour() {
	var old = C;
	do C = Math.floor(Math.random() * SCHEMES.length);
	while (C == old || SCHEMES[C].fb == undefined);
}

function change_character() {
	var old = I;
	do I = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].name;
	while (I == old);
	if (!CHARACTER_CACHE[I])
		CHARACTER_IMAGE.src = CHARACTER_MAP[I].filename;
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
}

function character_image_load() {
	var input_width = CHARACTER_MAP[I].width;
	var input_height = CHARACTER_MAP[I].height;
	var input_aspect = input_width / input_height;
	var output_width = WIDTH;
	var output_height = HEIGHT;
	var output_aspect = output_width / output_height;
	CHARACTER_CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);
	if (input_aspect > output_aspect) {
		var new_width = input_height * output_aspect;
		CHARACTER_CONTEXT.drawImage(
			CHARACTER_IMAGE,
			(input_width - new_width) / 2,
			0, new_width, input_height,
			0, 0, output_width, output_height
		);
	} else {
		var new_height = input_width / output_aspect;
		CHARACTER_CONTEXT.drawImage(
			CHARACTER_IMAGE, 0,
			(input_height - new_height) / 2,
			input_width, new_height,
			0, 0, output_width, output_height
		);
	}
	CHARACTER_CACHE[I] = CHARACTER_CONTEXT.
		getImageData(0, 0, WIDTH, HEIGHT);
};

TIMER_BEAT = setInterval(beat, DELAY_BEAT);
TIMER_FPS = setInterval(poll_fps, 1000);

global.onload = start;
global.onresize = resize;
CHARACTER_IMAGE.onload = character_image_load;

})(this);
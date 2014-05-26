(function(global) {

var READY = false;
var CANVAS = document.getElementById('canvas');
var CONTEXT = CANVAS.getContext('2d');
var WIDTH;
var HEIGHT;

var B = 0x00;
var T = 0x0000;

function load() {
	resize();
	function load_image(i) {
		var img =
			CHARACTERS[i].image_element =
			document.createElement('img');
		img.onload = function() {
			CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);
			CONTEXT.font = '32px Commodore';
			CONTEXT.textAlign = 'left';
			CONTEXT.fillText(
				'loading' + Array(i + 2).join('.'),
				20, 60
			);
			if (++i < CHARACTERS.length)
				requestAnimationFrame(
					load_image.bind(this, i)
				);
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
	Character.shuffle();
	Scheme.shuffle();
	Song.shuffle();
	requestAnimationFrame(frame);
	setInterval(function() {
		requestAnimationFrame(Song.beat);
	}, 100);
}

function frame(timestamp) {
	STATUS.frame_count++;
	STATUS.timestamp = timestamp;
	CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);
	CURRENT_CHARACTER.draw(CONTEXT, CURRENT_SCHEME);
	STATUS.draw(CONTEXT);
	Song.draw(timestamp, CONTEXT);
	requestAnimationFrame(frame);
}

function resize() {
	WIDTH = global.innerWidth;
	HEIGHT = global.innerHeight;
	CANVAS.width = WIDTH;
	CANVAS.height = HEIGHT;
	if (READY) {
		CHARACTERS.forEach(function(character) {
			character.cache(WIDTH, HEIGHT);
		});
	}
}

global.onload = requestAnimationFrame(load);
global.onresize = resize;

})(this);

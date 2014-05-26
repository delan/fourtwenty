(function(global) {

global.Song = function(name, rhythm) {
	this.index = null;
	this.name = name;
	this.rhythm = rhythm;
};

global.Song.shuffle = function() {
	var old = global.CURRENT_SONG;
	do global.CURRENT_SONG = global.SONGS[
		Math.floor(Math.random() * global.SONGS.length)
	]; while (global.CURRENT_SONG == old);
	global.CURRENT_RHYTHM = global.CURRENT_SONG.rhythm;
	global.STATUS.beat_count = 0;
	global.STATUS.frame_count = 0;
	global.STATUS.frame_count_last = 0;
};

global.Song.draw = function(timestamp, context) {
	context.font = '16px Commodore';
	context.textAlign = 'left';
	context.fillText(
		global.CURRENT_RHYTHM,
		context.canvas.width / 2 + 2, 16
	);
	context.textAlign = 'right';
	context.fillText(
		global.CURRENT_RHYTHM.split('').reverse().join(''),
		context.canvas.width / 2 - 2, 16
	);
	if (global.CURRENT_RHYTHM_DROP_TIMESTAMP) {
		var translate_x = 24;
		var animation_fraction = (
			timestamp - CURRENT_RHYTHM_DROP_TIMESTAMP - 100
		) / 150;
		if (animation_fraction > 0) {
			var alpha = 1 - animation_fraction;
			var rotate = Math.PI / 16 * animation_fraction;
			var translate_y = 32 * animation_fraction;
		} else {
			var alpha = 1;
			var rotate = 0;
			var translate_y = 0;
		}
		context.save();
		context.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
		context.font = '48px Commodore';
		if (CURRENT_RHYTHM_DROP_DIRECTION < 0) {
			context.textAlign = 'left';
			translate_x = -translate_x;
		} else {
			context.textAlign = 'right';
			rotate = -rotate;
		}
		context.translate(
			context.canvas.width / 2 + translate_x,
			56 + translate_y
		);
		context.rotate(rotate);
		context.fillText(global.CURRENT_RHYTHM_DROP_SYMBOL, 0, 0);
		context.restore();
	}
};

global.Song.beat = function(timestamp) {
	global.STATUS.beat_count++;
	global.CURRENT_RHYTHM =
		global.CURRENT_RHYTHM.substr(
			1, global.CURRENT_RHYTHM.length - 1
		) + global.CURRENT_RHYTHM[0];
	switch (global.CURRENT_RHYTHM[0]) {
	case 'x':
		Scheme.shuffle();
		Character.shuffle();
		global.CURRENT_RHYTHM_DROP_TIMESTAMP = timestamp;
		global.CURRENT_RHYTHM_DROP_SYMBOL = CURRENT_RHYTHM[0];
		global.CURRENT_RHYTHM_DROP_DIRECTION = Math.random() - 0.5;
		// vertical blur
		break;
	case 'o':
		Scheme.shuffle();
		Character.shuffle();
		global.CURRENT_RHYTHM_DROP_TIMESTAMP = timestamp;
		global.CURRENT_RHYTHM_DROP_SYMBOL = CURRENT_RHYTHM[0];
		global.CURRENT_RHYTHM_DROP_DIRECTION = Math.random() - 0.5;
		// horizontal blur
		break;
	case '|':
		Scheme.shuffle();
		Character.shuffle();
		// half beat blackout
		break;
	case '-':
		Scheme.shuffle();
		Character.shuffle();
		break;
	case '+':
		Scheme.shuffle();
		// horizontal blur
		// blackout
		break;
	case ':':
		Scheme.shuffle();
		break;
	case '.':
		break;
	default:
		break;
	}
};

global.CURRENT_SONG = null;
global.CURRENT_RHYTHM = null;
global.CURRENT_RHYTHM_DROP_TIMESTAMP = null;
global.CURRENT_RHYTHM_DROP_SYMBOL = null;
global.CURRENT_RHYTHM_DROP_DIRECTION = null;

global.SONGS = [
	new global.Song(
		'RESTOFMYLIF',
		'x..o..x......o.x..o.x....xo...o..x.....o' +
		'..x..ox.....xo..o..x......o.x....x....xo' +
		'...o..x......o.x..ox.....xo..o...x.....o' +
		'..x..ox.....xo..o..x......o.x..o.x....xo' +
		'...o..x......o.x..ox.....xo..o...x....xo' +
		'.x...ox.xx.x.'
	),
	new global.Song(
		'SMOKINGROLLIN',
		'o..ox..o...oo..xo...o..o.x.o...oo..xo...' +
		'o..o.x.o...oo..xo...o..o.x.o...oo..xo...'
	),
	new global.Song(
		'HOLDITIN',
		'o......x.....ooo.......x.......o......x.' +
		'....ooo.......x...o...o.......x.....ooo.' +
		'.....x.......o.......x.....ooo.......x..' +
		'.o...o......x.....ooo.......x.......o...' +
		'....x....ooo.......x...o...o.......x....' +
		'.ooo.......x......o.......x.....ooo-----' +
		'--x---o---'
	),
	new global.Song(
		'GOODWEED BAD BIATHC',
		'o..ox....oo.x...o..ox....oo.x...o..ox...' +
		'..o.x......ox....oo.x...'
	),
	new global.Song(
		'#420FGT',
		'o...x...o...x.o.o...x...o...x.o.o...x...' +
		'o...x.o.o...x...o...x.o.o...x...o...x.o.' +
		'o...x....o...x.o.o..x....o...x.o.o...o..' +
		'.o...x...o...x...o...x.o.o...x...o....x.' +
		'o.o..x...o...x.o.o....x..o....x.o.o...x.' +
		'..o...x.o.o...x...o....x.o.o..x...o...x.' +
		'o.o...o...o...o....'
	),
	new global.Song(
		'BECUZ I GOT HI',
		'x.....x...oo.....x.....o....x....oo..o..' +
		'xoo..o.....x...oo.....x.....o....x....oo' +
		'..o..xoo..o.....x...oo.....x.....o....x.' +
		'...oo..o..xoo..o.....x...oo.....x.....o.' +
		'...x...o.o..o..xoo..x.....x...oo.....x..' +
		'...o....x...o.o..o..xoo..o.....x...oo...' +
		'..x.....o....x...o.o..o..xoo..o.....x...' +
		'oo.....x.....o....x...o.o..o..xoo..o....' +
		'.x...oo.....x.....o.o..x.ooo.o..o.x.oo..'
	),
	new global.Song(
		'SMOKEWEED',
		'o...o...o...o...o...o...o...o...o...o...' +
		'o...o...o...o...o...o...o...o...o...o...' +
		'o...o...o...o...........................' +
		'.........'
	),
	new global.Song(
		'GREENPURPLE',
		'o....-....x.....o..o....o..o.....x....-.' +
		'.-.o.....-....x.....o..o....o..o.....x.o' +
		'........o....-....x.....o..o....o..o....' +
		'.x.....----.o..........x.......o..o.o..o' +
		'.....x.o........o....-.....x....o..o....' +
		'o..o....x.....-..-..o.........x.....o..o' +
		'....o..o.....x.o........o....-.....x....' +
		'o..o....o..o.....x.....----.o....-.....x' +
		'.......o..o.o..o....x..o........'
	),
];

global.SONGS.forEach(function(song, i) {
	song.index = i;
});

})(this);

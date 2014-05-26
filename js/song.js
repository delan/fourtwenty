(function(global) {

global.Song = function(name, rhythm) {
	this.index = null;
	this.name = name;
	this.rhythm = rhythm;
}

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

global.Song.draw = function(context) {
	context.font = '12pt Commodore';
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
};

global.CURRENT_SONG = null;
global.CURRENT_RHYTHM = null;

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

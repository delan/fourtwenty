(function(global) {

global.hex = function(number, digits) {
	var prefix = '$0x';
	var body = parseInt(number.toString()).toString(16);
	var length = digits + 1 - body.length;
	var padding = length > 0 ? Array(length).join('0') : '';
	return prefix + padding + body;
}

global.Status = function() {
	this.beat_count = NaN;
	this.timestamp = NaN;
	this.timestamp_last = NaN;
	this.frame_count = NaN;
	this.frame_count_last = NaN;
	this.frames_per_second = NaN;
	global.setInterval(this.update.bind(this), 1000);
};

global.Status.prototype.draw = function(context) {
	context.font = '8px Commodore';
	context.textAlign = 'left';
	[
		global.CURRENT_SONG.name,
		global.CURRENT_SCHEME.name,
		'V=$0x64', // always seems to be the same? version?
		'C=' + hex(global.CURRENT_SCHEME.index, 2),
		'Y=$0x00', // vertical blur intensity
		'X=$0x00', // horizontal blur intensity
		'B=' + hex(this.beat_count, 2),
		'T=' + hex(this.frame_count, 4),
		'I=' + global.CURRENT_CHARACTER.name,
		'M=FULL AUTO', // character cycling mode
		this.frames_per_second + ' Hz',
	].forEach(function(s, i) {
		context.fillText(s, 4, context.canvas.height - 10 * i - 10);
	});
};

global.Status.prototype.update = function() {
	this.frames_per_second = Math.floor(
		(this.frame_count - this.frame_count_last) /
		(this.timestamp - this.timestamp_last) * 1000
	) || 0;
	this.timestamp_last = this.timestamp;
	this.frame_count_last = this.frame_count;
};

global.STATUS = new global.Status();

})(this);

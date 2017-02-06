

function PixelBuffer(width, height, clearcolor) {
	this.width = width;
	this.height = height;
	this.clearcolor = clearcolor;
	this.frames = [];
	this.fullframes = [];
	this.beat_start_frame = 0;
	this.num_beats = 1;
	this.total_time = 0;
}

PixelBuffer.prototype.init = function(width, height, clearcolor) {
	this.clearcolor = clearcolor;
	this.width = width;
	this.height = height;
}

PixelBuffer.prototype.frame = function(fr) {
	this.frames.push(fr);
}

PixelBuffer.prototype.calc = function(callback) {
	var _this = this;

	var pixels = new Uint32Array(this.width * this.height);
	for(var i=0; i<this.width * this.height; i++) {
		pixels[i] = this.clearcolor;
	}

	this.frames.forEach(function(f) {
		if (f.clear) {
			for(var i=0; i<_this.width * _this.height; i++) {
				pixels[i] = _this.clearcolor;
			}
		}

		for(var j=0; j<f.height; j++) {
			for(var i=0; i<f.width; i++) {
				var x = f.x + i;
				var y = f.y + j;
				var c = f.pixels[j * f.width + i];
				if (((c >> 24) & 255) > 128) {
					pixels[y * _this.width + x] = c;
				}
			}
		}
		_this.fullframes.push({
			delay: f.delay,
			pixels: new Uint32Array(pixels)
		});
	});

	var total_time = 0;
	for(var j=this.fullframes.length-1; j>=0; j--) {
		total_time += this.fullframes[j].delay;
	}

	this.total_time = total_time;

	setTimeout(function() {
		callback({});
	}, 1);
}

exports.PixelBuffer = PixelBuffer;

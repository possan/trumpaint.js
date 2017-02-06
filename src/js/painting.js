var Painting = function() {
	this.lx = 0;
	this.ly = 0;
}

Painting.prototype.init = function() {
	this.bg = new Image()
	this.bg.src = 'paper.png'
	this.bg.onload = function() {
		this.clear()
	}.bind(this);

	this.can = document.getElementById('drawing');
	this.ctx = this.can.getContext('2d')

	this.can.addEventListener('mousedown', function(e) {
		// console.log('mousedown', e)
		this.down(e.offsetX, e.offsetY)
	}.bind(this));

	this.can.addEventListener('mousemove', function(e) {
		// console.log('mousemove', e)
		if (e.buttons) {
			this.drag(e.offsetX, e.offsetY)
		}
	}.bind(this));

	this.can.addEventListener('mouseup', function(e) {
		// console.log('mouseup', e)
		this.up(e.offsetX, e.offsetY)
	}.bind(this));

	this.can.addEventListener('touchstart', function(e) {
		// console.log('touchstart', e)
		var x = e.touches[0].clientX - this.can.offsetLeft
		var y = e.touches[0].clientY - this.can.offsetTop
		this.down(x, y)
		e.preventDefault();
		return false
	}.bind(this));

	this.can.addEventListener('touchmove', function(e) {
		// console.log('touchmove', e)
		var x = e.touches[0].clientX - this.can.offsetLeft
		var y = e.touches[0].clientY - this.can.offsetTop
		this.drag(x, y)
		e.preventDefault();
		return false
	}.bind(this));

	this.can.addEventListener('touchend', function(e) {
		// console.log('touchend', e)
		var x = e.touches[0].clientX - this.can.offsetLeft
		var y = e.touches[0].clientY - this.can.offsetTop
		this.up(x, y)
		e.preventDefault();
		return false
	}.bind(this));

	this.ctx.clearRect(0, 0, 480, 280)

	document.getElementById('btnclear').addEventListener('click', this.clear.bind(this))
}

Painting.prototype.down = function(x, y) {
	this.lx = x;
	this.ly = y;
}

Painting.prototype.drag = function(x, y) {
	this.ctx.strokeStyle = '#000'
	this.ctx.lineWidth = 10;
	this.ctx.lineCap = 'round'
	this.ctx.beginPath()
	this.ctx.moveTo(this.lx, this.ly)
	this.ctx.lineTo(x, y)
	this.ctx.stroke()
	this.lx = x;
	this.ly = y;
}

Painting.prototype.up = function(x, y) {
}

Painting.prototype.clear = function(x, y) {
	this.lx = 0;
	this.ly = 0;
	this.ctx.clearRect(0, 0, 480, 280)
	if (this.bg) {
		this.ctx.drawImage(this.bg, 0, 0, 480, 280)
	}
}

module.exports = Painting;
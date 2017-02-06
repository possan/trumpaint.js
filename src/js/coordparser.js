function CoordParser() {}

CoordParser.prototype.parse = function(inp) {
	var out = new Array()
	var re = /[\ \t]+/g;
	inp.split('\n').forEach(function(x) {
		var c = x.trim().split(re)
		// console.log('c', c)
		// x.split(re)
		var fr = parseInt(c[0], 10)
		out[fr] = {
			x: parseFloat(c[1]),
			y: parseFloat(c[2])
		}
	})
	return out
}

module.exports = CoordParser

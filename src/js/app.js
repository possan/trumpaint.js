var fetchmod = require('whatwg-fetch') // loaded globally
var GifReader = require('./gifreader.js')
var COORDS = require('./coords.js')
var CoordParser = require('./coordparser.js')
var Project = require('./project.js').Project
var Painting = require('./painting.js')

window.addEventListener('load', function() {
	console.log('onload');

	var pixelbuffer = null;
	var currentframe = 0
	var debug = 0

	var coords = {}
	var parser = new CoordParser()
	coords.topleft = parser.parse(COORDS.TOPLEFT)
	coords.bottomleft = parser.parse(COORDS.BOTTOMLEFT)
	coords.topcenter = parser.parse(COORDS.TOPCENTER)
	coords.bottomcenter = parser.parse(COORDS.BOTTOMCENTER)
	coords.topright = parser.parse(COORDS.TOPRIGHT)
	coords.bottomright = parser.parse(COORDS.BOTTOMRIGHT)
	console.log('coords', coords)

	document.getElementById('btndebug').addEventListener('click', function() {
		debug ++
		debug %= 2
	})

	var tempcan = document.createElement('canvas');
	var tempctx = tempcan.getContext('2d')

	var can = document.getElementById('preview');
	var ctx = can.getContext('2d')

	var painting = new Painting()
	painting.init()

	var warp1 = new Project.Unwarp({
		projectedwidth: 360,
		projectedheight: 310,
		flatwidth: 220,
		flatheight: 280
	});
	warp1.projectedCorner[0] = { x: 5, y: 5 };
	warp1.projectedCorner[1] = { x: 15, y: 5 };
	warp1.projectedCorner[2] = { x: 15, y: 15 };
	warp1.projectedCorner[3] = { x: 5, y: 15 };
	warp1.update();

	var canvaswarp1 = new Project.CanvasWarp({
		projection: warp1,
		projected: tempctx,
		flat: painting.ctx
	});

	var warp2 = new Project.Unwarp({
		projectedwidth: 360,
		projectedheight: 310,
		flatleft: 260,
		flatwidth: 220,
		flatheight: 280
	});
	warp2.projectedCorner[0] = { x: 25, y: 5 };
	warp2.projectedCorner[1] = { x: 35, y: 5 };
	warp2.projectedCorner[2] = { x: 35, y: 15 };
	warp2.projectedCorner[3] = { x: 25, y: 15 };
	warp2.update();

	var canvaswarp2 = new Project.CanvasWarp({
		projection: warp2,
		projected: tempctx,
		flat: painting.ctx,
		flatleft: 440,
	});

	// warp2.update();

	// var wrap2 = new Project.CanvasWrap({

	// })

	function renderFrame() {
		var fr = null;
		if (pixelbuffer) {
			fr = pixelbuffer.fullframes[currentframe]
		}

		ctx.width = 360
		ctx.height = 310
		ctx.clearRect(0, 0, 360, 310)

		if (pixelbuffer) {
			var data = ctx.getImageData(0, 0, pixelbuffer.width, pixelbuffer.height)
			var dataimg = data.data

			if (fr) {
				for(var j=0; j<pixelbuffer.width * pixelbuffer.height; j++) {
					var rgb = fr.pixels[j]
					dataimg[j * 4 + 0] = (rgb >> 0) & 255
					dataimg[j * 4 + 1] = (rgb >> 8) & 255
					dataimg[j * 4 + 2] = (rgb >> 16) & 255
					dataimg[j * 4 + 3] = 255
				}
			}

			ctx.putImageData(data, 0, 0)
		}

		// ctx.fillStyle = '#f0f'
		// ctx.fillRect(currentframe, 0, 1, 310)

		tempcan.width = 360
		tempcan.height = 310
		tempctx.width = 360
		tempctx.height = 310
		tempctx.fillStyle = '#fff'
		tempctx.fillRect(0, 0, 360, 310)

		var pt, pt1,pt2,pt3,pt4;
		var R = 10

		if (debug == 1) {
			if (typeof(coords.bottomleft[currentframe]) !== 'undefined') {
				pt = coords.bottomleft[currentframe]
				ctx.strokeStyle = '#f00'
				ctx.beginPath()
				ctx.rect(pt.x - R, pt.y - R, R * 2, R * 2)
				ctx.stroke()
			}

			if (typeof(coords.topleft[currentframe]) !== 'undefined') {
				pt = coords.topleft[currentframe]
				ctx.strokeStyle = '#f60'
				ctx.beginPath()
				ctx.rect(pt.x - R, pt.y - R, R * 2, R * 2)
				ctx.stroke()
			}

			if (typeof(coords.topcenter[currentframe]) !== 'undefined') {
				pt = coords.topcenter[currentframe]
				ctx.strokeStyle = '#fc0'
				ctx.beginPath()
				ctx.rect(pt.x - R, pt.y - R, R * 2, R * 2)
				ctx.stroke()
			}

			if (typeof(coords.bottomcenter[currentframe]) !== 'undefined') {
				pt = coords.bottomcenter[currentframe]
				ctx.strokeStyle = '#ff0'
				ctx.beginPath()
				ctx.rect(pt.x - R, pt.y - R, R * 2, R * 2)
				ctx.stroke()
			}

			if (typeof(coords.topright[currentframe]) !== 'undefined') {
				pt = coords.topright[currentframe]
				ctx.strokeStyle = '#cf6'
				ctx.beginPath()
				ctx.rect(pt.x - R, pt.y - R, R * 2, R * 2)
				ctx.stroke()
			}

			if (typeof(coords.bottomright[currentframe]) !== 'undefined') {
				pt = coords.bottomright[currentframe]
				ctx.strokeStyle = '#cf6'
				ctx.beginPath()
				ctx.rect(pt.x - R, pt.y - R, R * 2, R * 2)
				ctx.stroke()
			}
		}

		if (typeof(coords.bottomleft[currentframe]) !== 'undefined' &&
			typeof(coords.topleft[currentframe]) !== 'undefined' &&
			typeof(coords.topcenter[currentframe]) !== 'undefined' &&
			typeof(coords.bottomcenter[currentframe]) !== 'undefined') {
			pt1 = coords.topleft[currentframe]
			pt2 = coords.topcenter[currentframe]
			pt3 = coords.bottomcenter[currentframe]
			pt4 = coords.bottomleft[currentframe]

			warp1.projectedCorner[0] = { x: Math.round(pt1.x), y: Math.round(pt1.y) };
			warp1.projectedCorner[1] = { x: Math.round(pt2.x), y: Math.round(pt2.y) };
			warp1.projectedCorner[2] = { x: Math.round(pt3.x), y: Math.round(pt3.y) };
			warp1.projectedCorner[3] = { x: Math.round(pt4.x), y: Math.round(pt4.y) };
			warp1.update();
			canvaswarp1.drawProjected();
			// canvaswarp1.drawProjectedDebug(ctx);

			if (debug == 1) {
				ctx.strokeStyle = '#f00'
				ctx.beginPath()
				ctx.moveTo(pt1.x, pt1.y)
				ctx.lineTo(pt2.x, pt2.y)
				ctx.lineTo(pt3.x, pt3.y)
				ctx.lineTo(pt4.x, pt4.y)
				ctx.lineTo(pt1.x, pt1.y)
				ctx.moveTo(pt1.x, pt1.y)
				ctx.lineTo(pt3.x, pt3.y)
				ctx.moveTo(pt2.x, pt2.y)
				ctx.lineTo(pt4.x, pt4.y)
				ctx.stroke()
			}
		}


		if (typeof(coords.topcenter[currentframe]) !== 'undefined' &&
			typeof(coords.bottomcenter[currentframe]) !== 'undefined' &&
			typeof(coords.topright[currentframe]) !== 'undefined' &&
			typeof(coords.bottomright[currentframe]) !== 'undefined') {
			pt1 = coords.topcenter[currentframe]
			pt2 = coords.topright[currentframe]
			pt3 = coords.bottomright[currentframe]
			pt4 = coords.bottomcenter[currentframe]

			warp2.projectedCorner[0] = { x: Math.round(pt1.x), y: Math.round(pt1.y) };
			warp2.projectedCorner[1] = { x: Math.round(pt2.x), y: Math.round(pt2.y) };
			warp2.projectedCorner[2] = { x: Math.round(pt3.x), y: Math.round(pt3.y) };
			warp2.projectedCorner[3] = { x: Math.round(pt4.x), y: Math.round(pt4.y) };
			warp2.update();
			canvaswarp2.drawProjected();
			// canvaswarp2.drawProjectedDebug(ctx);

			if (debug == 1) {
				ctx.strokeStyle = '#0a0'
				ctx.beginPath()
				ctx.moveTo(pt1.x, pt1.y)
				ctx.lineTo(pt2.x, pt2.y)
				ctx.lineTo(pt3.x, pt3.y)
				ctx.lineTo(pt4.x, pt4.y)
				ctx.lineTo(pt1.x, pt1.y)
				ctx.moveTo(pt1.x, pt1.y)
				ctx.lineTo(pt3.x, pt3.y)
				ctx.moveTo(pt2.x, pt2.y)
				ctx.lineTo(pt4.x, pt4.y)
				ctx.stroke()
			}
		}

		// merge frames

		var overlaydata = tempctx.getImageData(0, 0, 360, 310)
		var overlaydataimg = overlaydata.data

		var mergedata = ctx.getImageData(0, 0, 360, 310)
		var mergedataimg = mergedata.data

		for(var j=0; j<360 * 310; j++) {
			var r1 = mergedataimg[j * 4 + 0]
			var g1 = mergedataimg[j * 4 + 1]
			var b1 = mergedataimg[j * 4 + 2]

			var r2 = overlaydataimg[j * 4 + 0]
			var g2 = overlaydataimg[j * 4 + 1]
			var b2 = overlaydataimg[j * 4 + 2]

			// r2 = Math.floor(Math.random() * 255)

			mergedataimg[j * 4 + 0] = (r1 * r2) >> 8
			mergedataimg[j * 4 + 1] = (g1 * g2) >> 8
			mergedataimg[j * 4 + 2] = (b1 * b2) >> 8
			mergedataimg[j * 4 + 3] = 255
		}

		ctx.putImageData(mergedata, 0, 0)

		if (pixelbuffer) {
			currentframe ++
			if (currentframe >= pixelbuffer.fullframes.length) {
				currentframe = 0
			}
		}

		queueFrame()
	}

	function queueFrame() {
		setTimeout(renderFrame.bind(this), 30)
	}

	var gr = new GifReader()
	gr.read('empty.gif', function(_gr) {
		pixelbuffer = _gr.pixelbuffer
		console.log('pixelbuffer', pixelbuffer)
	})

	queueFrame()

});

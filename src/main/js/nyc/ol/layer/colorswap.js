var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/**
 * @desc An event handler for ol.layer.Layer#postcompose to re-render the layer in with colors swapped
 * @public
 * @function
 * @param {ol.render.Event} event The event data from the ol.layer.Layer#postcompose event
 * @param {Array<Array<number>>} beforeColors The RGB values of the colors to replace
 * @param {Array<Array<number>>} afterColors The RGB values of the replacement colors
 * @param {number} [variance=0] The variance for considering RGB values equal
 */
nyc.ol.layer.colorswap = function(event, beforeColors, afterColors, variance) {
	var context = event.context;
	var closeEnough = function(actual, expected){
		return Math.abs(actual - expected) <= variance;
	};
	if (context){
		try{
			var canvas = context.canvas;
			var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			var pixelArray = imageData.data;
			var length = pixelArray.length / 4; // 4 components - red, green, blue and alpha
			for (var i = 0; i < length; i++) {
			    var index = 4 * i;
			    var r = pixelArray[index];
			    var g = pixelArray[++index];
			    var b = pixelArray[++index];
			    var a = pixelArray[++index];
			    $.each(beforeColors, function(whichColor, beforeColor){
			    	if (
				    		closeEnough(r, beforeColor[0]) && 
				    		closeEnough(g, beforeColor[1]) && 
				    		closeEnough(b, beforeColor[2])
				    	) {
			    			var afterColor = afterColors[whichColor];
					    	pixelArray[--index] = afterColor[2];
					        pixelArray[--index] = afterColor[1];
					        pixelArray[--index] = afterColor[0];
					    }			    	
			    });
			    
			}
			context.putImageData(imageData, 0, 0);
		}catch (ignore){
			/* don't break if canvas has cross-origin data */
		} 
	}
};
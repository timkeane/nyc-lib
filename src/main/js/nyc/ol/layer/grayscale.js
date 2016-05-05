var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/**
 * @desc An event handler for ol.layer.Layer#postcompose to re-render the layer in grayscale
 * @public
 * @function
 * @param {ol.render.Event} event The event data from the ol.layer.Layer#postcompose event
 */
nyc.ol.layer.grayscale = function(event) {
	var context = event.context;
	if (context){
		try{
			var canvas = context.canvas;
			var width = canvas.width;
			var height = canvas.height;
			var inputData = context.getImageData(0, 0, width, height).data;
			var outputData = context.createImageData(width, height);
			var d = outputData.data;
			for(var i = 0; i < inputData.length; i += 4){
				var r = inputData[i];
				var g = inputData[i + 1];
				var b = inputData[i + 2];
				// CIE luminance for the RGB
				var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
				d[i + 0] = v;	// Red
				d[i + 1] = v;	// Green
				d[i + 2] = v;	// Blue
				d[i + 3] = 255;	// Alpha
			}
			context.putImageData(outputData, 0, 0);
		}catch (ignore){
			/* don't break if canvas has cross-origin data */
			if (!nyc.ol.layer.grayscale.errorLogged){
				console.warn(ignore);
				nyc.ol.layer.grayscale.errorLogged = true;
			}
		} 
	}
};
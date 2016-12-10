var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

nyc.ol.control.ui = {
	js: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
	css: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css',
	loaded: false,
	load: function(){
		if (!nyc.ol.control.ui.loaded){
			$.getScript(nyc.ol.control.ui.js);
			if (document.createStyleSheet){
		        document.createStyleSheet(nyc.ol.control.ui.css);
		    }else{
		        $('head').append($('<link rel="stylesheet" href="' + nyc.ol.control.ui.css + '" type="text/css">'));
		    }
			nyc.ol.control.ui.loaded = true;
		}
	}
};
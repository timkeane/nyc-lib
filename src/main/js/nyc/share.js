var nyc = nyc || {};

/**
 * @desc Class for providing a set of buttons for social media sharing
 * @public
 * @class
 * @constructor
 * @property {(String|Element|JQuery)} target The HTML DOM element that will provide share buttons
 */
nyc.Share = function(target){
	var me = this, html = nyc.Share.HTML, title = $('meta[property="og:title"]').attr('content');
	html = html.replace(/\${url}/g, $('meta[property="og:url"]').attr('content'));
	html = html.replace(/\${title}/g, title);
	html = html.replace(/\${description}/g, $('meta[property="og:description"]').attr('content'));
	$(target).append(html).trigger('create');

	 $('#share-btn').click(function(){
		 $('#share-btns').fadeToggle(function(){
			$('*').one('click', function(e){
				if ($('#share-btns').css('opacity') == 1){
					$('#share-btns').fadeOut();
				}
			});
		 });
	 }); 
	if (this.isIosAppMode()){
		$('#email-btn').attr('target', '_blank');
	}
};

nyc.Share.prototype = {
	/**
	 * @private
	 * @method
	 * @return {boolean}
	 */
	isIosAppMode: function(){
		return navigator.standalone && nyc.util.isIos();
	}
};

/**
 * @private
 * @const
 * @type {string}
 */
nyc.Share.HTML = 
	'<a id="share-btn" class="ctl ctl-btn" data-role="button" title="Share...">' +
		'<span class="noshow">Share...</span>' +
	'</a>' +
	'<div id="share-btns" class="ctl">' +
		'<a id="facebook-btn" class="ctl-btn" data-role="button" href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener noreferrer" title="Facebook">' +
			'<span class="noshow">Facebook</span>' +
		'</a>' +
		'<a id="twitter-btn" class="ctl-btn" data-role="button" href="https://twitter.com/intent/tweet?text=${url} @nycgov&source=webclient" target="_blank" rel="noopener noreferrer" title="Twitter">' +
			'<span class="noshow">Twitter</span>' +
		'</a>' +
		'<a id="google-btn" class="ctl-btn" data-role="button" href="https://plus.google.com/share?url=${url}" target="_blank" rel="noopener noreferrer" title="Google+">' +
			'<span class="noshow">Google+</span>' +
		'</a>' +
		'<a id="linkedin-btn" class="ctl-btn" data-role="button" href="http://www.linkedin.com/shareArticle?mini=true&url=${url}" target="_blank" rel="noopener noreferrer" title="LinkedIn">' +
			'<span class="noshow">LinkedIn</span>' +
		'</a>' +
		'<a id="tumblr-btn" class="ctl-btn" data-role="button" href="http://www.tumblr.com/share/link?url=${url}&name=${title}&description=via%20NYC.gov" target="_blank" rel="noopener noreferrer" title="Tumblr">' +
			'<span class="noshow">Tumblr</span>' +
		'</a>' +
		'<a id="email-btn" class="ctl-btn" data-role="button" href="mailto:?subject=${title}&body=${description}%0A%0A${url}" title="email">' +
			'<span class="noshow">Email</span>' +
		'</a>' +
	'</div>';

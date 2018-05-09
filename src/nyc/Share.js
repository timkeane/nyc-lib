/**
 * @module nyc/Share
 */

import $ from 'jquery'

import Container from 'nyc/Container'
import Container from 'nyc/ReplaceTokens'

/**
 * @desc Class for providing a set of buttons for social media sharing
 * @public
 * @class
 * @extends {Container}
 * @mixin ReplaceTokens
 */
class Share extends Container {
	/**
	 * @desc Class for providing a set of buttons for social media sharing
	 * @public
	 * @constructor
	 * @property {JQuery|Element|string} target The HTML DOM element that will provide share buttons
	 */
	constructor(target) {
		super(target)
		nyc.mixin(this, [ReplaceTokens.prototype])
		const fetch = window.fetch || require('node-fetch')
		fetch(options.url || './manifest.webmanifest').then((respose) => {
			return respose.json()
		}).then(mainfest => {
			this.append(this.replace(Share.HTML, mainfest))
			this.hookupEvents()
		})
	}
	hookupEvents() {
		const btns = this.find('.btns')
	 	this.find('.shr-btn').click(() => {
		 btns.fadeToggle(() => {
			$('*').one('click', (event) => {
				if (btns.css('display') === 'block') {
					btns.fadeOut()
				}
			})
		 })
	 })
 }
}


/**
 * @desc Constructor options
 * @public
 * @typedef {Object}
 * @property {JQuery|Element|string} target The HTML DOM element that will provide share buttons
 * @property {string} url Manifest URL
 */
Share.Options
/**
 * @private
 * @const
 * @type {string}
 */
Share.HTML = '<a class="shr-btn" class="ctl sq-btn" role="button" title="Share...">' +
	'<span class="screen-reader-only">Share...</span>' +
'</a>' +
'<div class="shr">' +
	'<a class="facebook-btn" class="sq-btn" role="button" href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener noreferrer" title="Facebook">' +
		'<span class="screen-reader-only">Facebook</span>' +
	'</a>' +
	'<a class="twitter-btn" class="sq-btn" role="button" href="https://twitter.com/intent/tweet?text=${url} @nycgov&source=webclient" target="_blank" rel="noopener noreferrer" title="Twitter">' +
		'<span class="screen-reader-only">Twitter</span>' +
	'</a>' +
	'<a class="google-btn" class="sq-btn" role="button" href="https://plus.google.com/share?url=${url}" target="_blank" rel="noopener noreferrer" title="Google+">' +
		'<span class="screen-reader-only">Google+</span>' +
	'</a>' +
	'<a class="linkedin-btn" class="sq-btn" role="button" href="http://www.linkedin.com/shareArticle?mini=true&url=${url}" target="_blank" rel="noopener noreferrer" title="LinkedIn">' +
		'<span class="screen-reader-only">LinkedIn</span>' +
	'</a>' +
	'<a class="tumblr-btn" class="sq-btn" role="button" href="http://www.tumblr.com/share/link?url=${url}&name=${title}&description=via%20NYC.gov" target="_blank" rel="noopener noreferrer" title="Tumblr">' +
		'<span class="screen-reader-only">Tumblr</span>' +
	'</a>' +
	'<a class="email-btn" class="sq-btn" role="button" href="mailto:?subject=${title}&body=${description}%0A%0A${url}" title="email">' +
		'<span class="screen-reader-only">Email</span>' +
	'</a>' +
'</div>'

export default Share

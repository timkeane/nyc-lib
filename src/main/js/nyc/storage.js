var nyc = nyc || {};

nyc.storage = {
	/** 
	 * @desc Check if download is available
	 * @public 
	 * @function
	 * @return {boolean}
	 */
	canDownload: function(name, data){
		return 'download' in $('<a></a>').get(0);
	},
	/** 
	 * @desc Save data to a file prompting the user with a file dialog
	 * @public 
	 * @function
	 * @param {string} name File name
	 * @param {string} data JSON data to write to file
	 */
	saveToFile: function(name, data){
		var href;
		if (nyc.util.saveFile(name, data)){
			href = 'filesystem:' + document.location.origin + '/temporary/' + name;
		}else{
			href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
		}
		var a = $('<a><img></a>');
		$('body').append(a);
		a.attr('href', href).attr('download', name).find('img').trigger('click');
		a.remove();
	},
	/** 
	 * @desc Save data to a file prompting the user with a file dialog
	 * @public 
	 * @function
	 * @param {string} name File name
	 * @param {string} data Data to write to file
	 * @param {boolean} [persistent=false] Persistent or only for current session
	 * @return {boolean} success
	 */
	saveFile: function(name, data, persistent){
		var fs = nyc.util.fsMethod();
		if (fs){
			fs.scope[fs.fn](persistent ? PERSISTENT : TEMPORARY, 1024 * 1024 * 100, function(fs){
				fs.root.getFile(name, {create: true}, function(file){
					file.createWriter(function(content){
						content.write(new Blob([data], {type: 'text/plain'}));
					});
				});
			}, function(){console.error(arguments);});
			return true;
		}else{
			console.error('File system access unavailable');
			return false;
		}
	},
	/** 
	 * @desc Set data in localStorage if available
	 * @public 
	 * @function
	 * @param {string} key Storage key
	 * @param {string} data Data to store
	 */
	setItem: function(key, data) {
		if ('localStorage' in window){
			localStorage.setItem(key, data);
		}
	},
	/** 
	 * @desc Get data from localStorage if available
	 * @public 
	 * @function
	 * @param {string} key Storage key
	 * @return {string}
	 */
	getItem: function(key) {
		if ('localStorage' in window){
			return localStorage.getItem(key);
		}
	},
	/** 
	 * @desc Remove data from localStorage if available
	 * @public 
	 * @function
	 * @param {string} key Storage key
	 * @return {string}
	 */
	removeItem: function(key) {
		if ('localStorage' in window){
			return localStorage.removeItem(key);
		}
	},
	/**
	 * @private
	 * @method
	 * @return {Object}
	 */
	fsMethod: function(){
		if ('requestFileSystem' in navigator){
			return {scope: navigator, fn: 'requestFileSystem'};
		}else if ('webkitRequestFileSystem' in window){
			return {scope: window, fn: 'webkitRequestFileSystem'};
		}
	}
};
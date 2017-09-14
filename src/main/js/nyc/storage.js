var nyc = nyc || {};

/**
 * @public
 * @namespace
 */
nyc.storage = {};

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @constructor
 */
nyc.storage.Local = function(){};

nyc.storage.Local.prototype = {
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
	saveGeoJson: function(name, data){
		var href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
		var a = $('<a class="file-dwn"><img></a>');
		$('body').append(a);
		a.attr('href', href).attr('download', name).find('img').trigger('click');
		a.remove();
	},
	/**
	 * @desc Set data in localStorage if available
	 * @public
	 * @function
	 * @param {string} key Storage key
	 * @param {string} data Data to store
	 */
	setItem: function(key, data){
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
	getItem: function(key){
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
	removeItem: function(key){
		if ('localStorage' in window){
			return localStorage.removeItem(key);
		}
	},
	/**
	 * @desc Open a text file from local disk
	 * @public
	 * @function
	 * @param {function} callback The callback function to receive file content
	 * @param {File=} file File name
	 */
	readTextFile: function(callback, file){
		var reader = new FileReader();
		reader.onload = function(){
			callback(reader.result);
		};
		if (!file){
			var input = $('<input class="file-in" type="file">');
			$('body').append(input);
			input.change(function(event){
				input.remove();
				reader.readAsText(event.target.files[0]);
			});
			input.click();
		}else{
			reader.readAsText(file);
		}
	},
	/**
	 * @desc Open a GeoJSON file from local disk
	 * @public
	 * @function
	 * @param {ol.Map|L.Map} map The map in which the data will be displayed
	 * @param {function=} callback The callback function to receive the added ol.vector.Layer
	 * @param {string=} file File name
	 */
	loadGeoJsonFile: function(map, callback, file){
		var me = this;
		me.readTextFile(function(geoJson){
			var layer = me.addToMap(map, geoJson);
			if (callback) callback(layer);
		}, file);
	},
	/**
	 * @desc Open a shapefile from local disk
	 * @public
	 * @function
	 * @param {ol.Map|L.Map} map The map in which the data will be displayed
	 * @param {function=} callback The callback function to receive the added ol.vector.Layer
	 * @see https://github.com/mbostock/shapefile
	 */
	loadShapeFile: function(map, callback){
		var me = this, input = $('<input class="file-in" type="file" multiple>'), shp, dbf, prj;
		$('body').append(input);
		input.change(function(event){
			input.remove();
			var files = event.target.files;
			$.each(files, function(){
				var ext = this.name.substr(name.length - 4);
				if (ext == '.shp') shp = this;
				else if (ext == '.dbf') dbf = this;
				else if (ext == '.prj') prj = this;
			});
			me.readPrj(prj, function(projcs){
				me.readShpDbf(map, shp, dbf, projcs, callback);
			});
		});
		input.click();
	},
	/**
	 * @private
	 * @method
	 * @param {File} prj
	 * @param {function} callback
	*/
	readPrj: function(prj, callback){
		if (prj){
			this.readTextFile(callback, prj);
		}else{
			callback();
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map|L.Map} map
	 * @param {File} shp
	 * @param {File} dbf
	 * @param {string} projcs
	 * @param {function} callback
	*/
	readShpDbf: function(map, shp, dbf, projcs, callback){
		var me = this, shpBuffer, dbfBuffer;

		var shpReader = new FileReader();
		shpReader.onload = function(event){
			shpBuffer = event.target.result;
			if (dbfBuffer || !dbf){
				me.readShp(map, shpBuffer, dbfBuffer, projcs, callback);
			}
		};

		var dbfReader = new FileReader();
		dbfReader.onload = function(event){
			dbfBuffer = event.target.result;
			if (shpBuffer){
				me.readShp(map, shpBuffer, dbfBuffer, projcs, callback);
			}
		};

		shpReader.readAsArrayBuffer(shp);
		if (dbf) dbfReader.readAsArrayBuffer(dbf);
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map|L.Map} map
	 * @param {string|ArrayBuffer} shp
	 * @param {string|ArrayBuffer} dbf
	 * @param {function} callback
	*/
	readShp: function(map, shp, dbf, projcs, callback){
		var me = this, features = [];
		shapefile.open(shp, dbf)
		  .then(source => source.read()
			  .then(function collect(result){
					if (result.done){
						var layer = me.addToMap(map, features, projcs);
						if (callback) callback(layer);
						return;
					}else{
						features.push(result.value);
					}
					return source.read().then(collect);
				})
			).catch(error => console.error(error.stack));
	},
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {ol.Map|L.Map} map
	 * @param {string|Array<Object>} features
	 * @param {string} projcs
	 * @return {Object}
	*/
	addToMap: function(map, features, projcs){
		throw 'Must be implemented';
	},
	/**
	 * @private
	 * @method
	 * @param {string} projcs
	  * @return {string|undefined}
	*/
	customProj: function(projcs){
		if (projcs){
			proj4.defs('shp:prj', projcs);
			return 'shp:prj';
		}
	}
};

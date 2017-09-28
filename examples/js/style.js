var finderStyle = function(feature, resolution){
  var type = feature.get('type');
  var zoom = nyc.ol.TILE_GRID.getZForResolution(resolution);
  finderStyle.cache[type] = finderStyle.cache[type] || {};
  if (!finderStyle.cache[type][zoom]){
    var size = 16;
    if (zoom > 11) size = 24;
    if (zoom > 14) size = 32;
    finderStyle.cache[type][zoom] = new ol.style.Style({
      image: new ol.style.Icon({
        src: 'img/' + type + '.png',
        scale: size / 232
      })
    });
  }
  return finderStyle.cache[type][zoom];
};

finderStyle.cache = {};

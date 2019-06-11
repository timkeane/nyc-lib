$(document).trigger('click');
var c = [-8005606, 4792924];
var v = map.getView();
v.animate({zoom: 10}, {center: c, zoom: 13, duration: 5000});
setTimeout(() => {
  var i = setInterval(() => {
    v.animate({
      zoom: v.getZoom()+1,
      duration: 2000
    });
    if (v.getZoom() > 15) clearInterval(i);
  }, 3000);
}, 2000);

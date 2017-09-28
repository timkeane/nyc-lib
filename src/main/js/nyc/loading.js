
/**
 * @desc Create a loading page
 * @public
 * @class
 * @constructor
 */
nyc.Loading = function(){
  $('body').pagecontainer()
    .append('<div id="loading" data-role="page"><div><div>maps.nyc.gov</div></div></div>')
    .trigger('create');
};

/**
 * @desc Create a loading page
 * @public
 * @class
 * @constructor
 */
nyc.Loading = function(){
  this.loading = $('<div id="loading" data-role="page"><div><div>maps.nyc.gov</div></div></div>');
  $('.ui-loading').remove();
  $('body').pagecontainer().append(this.loading).trigger('create');
};

nyc.Loading.prototype = {
  loading: null,
  loaded: function(){
    var loading = this.loading;
    loading.fadeOut(function(){
      loading.remove();
    });
  }
};

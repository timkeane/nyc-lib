function draggableCartoInfoWin(infowinNode) {
	
	var drag = new nyc.Drag({
		target: infowinNode,
		tail:true,
		tailOffset:[0,-14]
	})
	
	$(infowinNode).data('visibility', 'hidden')
	$(infowinNode).data('display', 'none')
	
	var observer = new MutationObserver(function(mutations) {
		var vizWas = $(infowinNode).data('visibility')
		var dispWas = $(infowinNode).data('display')
		$.each(mutations, function(_, mutation) {
			if (mutation.attributeName === 'style'){
				var vizIs = $(infowinNode).css('visibility')
				var dispIs = $(infowinNode).css('display')
				if (vizIs !== vizWas || dispIs !== dispWas) {
					drag.resetTail()
					if (vizIs === 'hidden') {
						$(infowinNode).css({
							left: 'unset',
							top: 'unset',
							right: 'unset',
							bottom: 'unset'
						})
					}
				}
				$(infowinNode).data('visibility', vizIs)
				$(infowinNode).data('display', dispIs)
				return false
			}
		});
	});
	observer.observe(infowinNode, {attributes: true})
}

$.getScript('https://maps.nyc.gov/nyc-lib/v1.2.37/js/nyc-lib.js', function(){
	$('.cartodb-infowindow').each(function(i, inf){
		draggableCartoInfoWin(inf)
	})
})

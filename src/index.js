import _nyc from './nyc/nyc'
import _nyc_BasemapHelper from './nyc/BasemapHelper'
import _nyc_EventHandling from './nyc/EventHandling'
import _nyc_ReplaceTokens from './nyc/ReplaceTokens'

window.nyc = _nyc
window.nyc.BasemapHelper = _nyc_BasemapHelper
window.nyc.EventHandling = _nyc_EventHandling
window.nyc.ReplaceTokens = _nyc_ReplaceTokens

import _ol from './nyc/ol/ol'
import _ol_Basemap from './nyc/ol/Basemap'

window.nyc.ol = _ol
window.nyc.ol.Basemap = _ol_Basemap

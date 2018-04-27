import _nyc from 'nyc/nyc'
import _nyc_BasemapHelper from 'nyc/BasemapHelper'
import _nyc_EventHandling from 'nyc/EventHandling'
import _nyc_ReplaceTokens from 'nyc/ReplaceTokens'
import _nyc_CtlContainer from 'nyc/CtlContainer'
import _nyc_ZoomSearch from 'nyc/ZoomSearch'

window.nyc = _nyc
window.nyc.BasemapHelper = _nyc_BasemapHelper
window.nyc.EventHandling = _nyc_EventHandling
window.nyc.ReplaceTokens = _nyc_ReplaceTokens
window.nyc.CtlContainer = _nyc_CtlContainer
window.nyc.ZoomSearch = _nyc_ZoomSearch

import _ol from 'nyc/ol/ol'
import _ol_Basemap from 'nyc/ol/Basemap'

window.nyc.ol = _ol
window.nyc.ol.Basemap = _ol_Basemap

import $ from 'jquery'

import _nyc from 'nyc/nyc'
import _nyc_AutoComplete from 'nyc/AutoComplete'
import _nyc_BasemapHelper from 'nyc/BasemapHelper'
import _nyc_Choice from 'nyc/Choice'
import _nyc_Collapsible from 'nyc/Collapsible'
import _nyc_Container from 'nyc/Container'
import _nyc_Dialog from 'nyc/Dialog'
import _nyc_EventHandling from 'nyc/EventHandling'
import _nyc_Geoclient from 'nyc/Geoclient'
import _nyc_Geocoder from 'nyc/Geocoder'
import _nyc_Locator from 'nyc/Locator'
import _nyc_LocationMgr from 'nyc/LocationMgr'
import _nyc_MapLocator from 'nyc/MapLocator'
import _nyc_ReplaceTokens from 'nyc/ReplaceTokens'
import _nyc_ZoomSearch from 'nyc/ZoomSearch'

window.nyc = _nyc
window.nyc.AutoComplete = _nyc_AutoComplete
window.nyc.BasemapHelper = _nyc_BasemapHelper
window.nyc.Choice = _nyc_Choice
window.nyc.Collapsible = _nyc_Collapsible
window.nyc.Container = _nyc_Container
window.nyc.Dialog = _nyc_Dialog
window.nyc.EventHandling = _nyc_EventHandling
window.nyc.Geoclient = _nyc_Geoclient
window.nyc.Geocoder = _nyc_Geocoder
window.nyc.Locator = _nyc_Locator
window.nyc.LocationMgr = _nyc_LocationMgr
window.nyc.MapLocator = _nyc_MapLocator
window.nyc.ReplaceTokens = _nyc_ReplaceTokens
window.nyc.ZoomSearch = _nyc_ZoomSearch

import _nyc_ol from 'nyc/ol/ol'
import _nyc_ol_Basemap from 'nyc/ol/Basemap'
import _nyc_ol_Locator from 'nyc/ol/Locator'
import _nyc_ol_MapLocator from 'nyc/ol/MapLocator'
import _nyc_ol_ZoomSearch from 'nyc/ol/ZoomSearch'

window.nyc.ol = _nyc_ol
window.nyc.ol.Basemap = _nyc_ol_Basemap
window.nyc.ol.Locator = _nyc_ol_Locator
window.nyc.ol.MapLocator = _nyc_ol_MapLocator
window.nyc.ol.ZoomSearch = _nyc_ol_ZoomSearch

import _nyc_ol_format_CsvPoint from 'nyc/ol/format/CsvPoint'
import _nyc_ol_format_Decorate from 'nyc/ol/format/Decorate'

window.nyc.ol.format = {}
window.nyc.ol.format.CsvPoint = _nyc_ol_format_CsvPoint
window.nyc.ol.format.Decorate = _nyc_ol_format_Decorate

import _nyc_ol_source_AutoLoad from 'nyc/ol/source/AutoLoad'
import _nyc_ol_source_FilterAndSort from 'nyc/ol/source/FilterAndSort'

window.nyc.ol.source = {}
window.nyc.ol.source.AutoLoad = _nyc_ol_source_AutoLoad
window.nyc.ol.source.FilterAndSort = _nyc_ol_source_FilterAndSort

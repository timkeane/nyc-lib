# nyc-lib

[![Build Status](https://travis-ci.org/timkeane/nyc-lib.svg?branch=master)](https://travis-ci.org/timkeane/nyc-lib) [![Coverage Status](https://coveralls.io/repos/github/timkeane/nyc-lib/badge.svg?branch=master)](https://coveralls.io/github/timkeane/nyc-lib?branch=node)

A set of common libraries used to develop NYC mapping applications

[Documentation and Examples](https://maps.nyc.gov/nyc-lib/)

### Using with Node

* `yarn add nyc-lib`
* `npm install nyc-lib`

The following libraries are extenal requiremnents that must be included separately in your build or in your HTML page:
* proj4
* ol
* jquery

The following libraries are extenal requiremnets that may be optionally included separately depending on desired functionality:
* shapefile
* papaparse
* leaflet

### Using in an HTML page

OpenLayers
```
<link href="https://maps.nyc.gov/nyc-lib/vX.X.X/css/nyc-ol-lib.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.5/ol.js"></script>
<script src="https://maps.nyc.gov/nyc-lib/vX.X.X/js/nyc-ol-lib.js"></script>
```

Leaflet
```
<link href="https://maps.nyc.gov/nyc-lib/vX.X.X/css/nyc-lib.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.js"></script>
<script src="https://maps.nyc.gov/nyc-lib/vX.X.X/js/nyc-leaf-lib.js"></script>
```

### Building

* Set environment variable `NODE_ENV` to `dev`, `stg`, or `prd`
* Contact author for addition evnvironment variables that should be included in your `.env` file
* If you plan on load testing an application that uses this library you must do so using a staging build

### Geocoding

* To use `nyc.Geoclient` as the implementation of `nyc.Geocoder` you must first get your Geoclient App ID and App Key from the [NYC Developer Portal] (https://developer.cityofnewyork.us/api/geoclient-api)
  * Register if you don't have an NYC Developer Portal account
  * Developer Management > View or Create a New Project...
* If you work for NYC you may contect the DoITT GIS unit for your App ID and App Key to use a DoITT hosted and supported version of Geoclient
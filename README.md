# nyc-lib

A set of common libraries used to develop NYC mapping applications

###Documentation, Examples and Distributions###
https://maps.nyc.gov/nyc-lib

###Geocoding###
* To use `nyc.Geoclient` as the implementation of `nyc.Geocoder` you must first get your Geoclient App ID and App Key from the [NYC Developer Portal](https://developer.cityofnewyork.us/api/geoclient-api)
  * Register if you don't have an NYC Developer Portal account
  * Developer Management > View or Create a New Project...
  * Configure [Gradle](http://./gradlew.org/)
    * Set `git.geoclient.url='//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID'` in `$GRADLE_USER_HOME/./gradlew.properties`
    * Set `test.geoclient.url='//maps.nyc.gov/geoclient/v1/search.json?app_key={actual App Key}&app_id={actual App ID}'` in `$GRADLE_USER_HOME/./gradlew.properties`

###Tests###
* Run `./gradlew jettyRun` and navigate your browser to `http://localhost:8088/src/main/test/` to run [QUnit](https://qunitjs.com/) tests
* To successfully run test `nyc.Geocoder.search (address)` you must configure [Gradle](http://./gradlew.org/) as describe above

###Build###
* `./gradlew buildLibs`
	* builds libraries `nyc-ol-lib.js`, `nyc-ol-redline-lib.js`, `nyc-leaf-lib.js`, `nyc.carto-lib.js`
* `./gradlew jsDoc` (requires npm and jsdoc)
	* builds [JsDoc](http://usejsdoc.org/)
* `./gradlew archive`  (requires npm and jsdoc)
	* builds and zips libraries `nyc-ol-lib.js`, `nyc-ol-redline-lib.js`, `nyc-leaf-lib.js`, `nyc.carto-lib.js` with [JsDoc](http://usejsdoc.org/)
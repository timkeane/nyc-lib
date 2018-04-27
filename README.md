# nyc-lib

[![Build Status](https://travis-ci.org/timkeane/nyc-lib.svg?branch=node)](https://travis-ci.org/timkeane/nyc-lib) [![Coverage Status](https://coveralls.io/repos/github/timkeane/nyc-lib/badge.svg?branch=node)](https://coveralls.io/github/timkeane/nyc-lib?branch=node)

A set of common libraries used to develop NYC mapping applications

### Geocoding

* To use ```nyc.Geoclient``` as the implementation of ```nyc.Geocoder``` you must first get your Geoclient App ID and App Key from the [NYC Developer Portal](https://developer.cityofnewyork.us/api/geoclient-api)
  * Register if you don't have an NYC Developer Portal account
  * Developer Management > View or Create a New Project...
  * Configure [Gradle](http://gradle.org/)
    * Set ```git.geoclient.url='//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID'``` in ```$GRADLE_USER_HOME/gradle.properties```
    * Set ```test.geoclient.url='//maps.nyc.gov/geoclient/v1/search.json?app_key={actual App Key}&app_id={actual App ID}'``` in ```$GRADLE_USER_HOME/gradle.properties```

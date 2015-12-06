# nyc-lib

Run [QUnit](https://qunitjs.com/) tests by launching ```src/test/index.html```

Build with [gradle](http://gradle.org/)
* ```gradle buildLibs``` or ```gradlew buildLibs```
	* builds libraries ```nyc-ol-lib.js```, ```nyc-leaf-lib.js```, ```nyc.carto-lib.js```
* ```gradle jsDoc``` or ```gradlew jsDoc``` 
	* builds [JsDoc](http://usejsdoc.org/)
* ```gradle archive``` or ```gradlew archive``` 
	* builds and zips libraries ```nyc-ol-lib.js```, ```nyc-leaf-lib.js```, ```nyc.carto-lib.js``` with [JsDoc](http://usejsdoc.org/)
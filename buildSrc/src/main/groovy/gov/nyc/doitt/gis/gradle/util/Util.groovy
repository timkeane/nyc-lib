package gov.nyc.doitt.nyc.gis.gradle.util

class Util {
	static String getDirectoryName(String fullPath){
		String dir = fullPath.replaceAll('\\\\', '/')
		int lastSlash = dir.lastIndexOf('/')
		return dir.substring(0, lastSlash)
	}
}
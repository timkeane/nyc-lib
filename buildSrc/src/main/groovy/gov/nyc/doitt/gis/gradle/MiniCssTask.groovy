package gov.nyc.doitt.nyc.gis.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction
import gov.nyc.doitt.nyc.gis.gradle.util.Util

class MiniCssTask extends DefaultTask {
	def libName = ''
	def themeFile = ''
	def fileNames = []
	def sourceDir = ''
	def destinationDir = ''
	@TaskAction
	public void minify(){
		def dir = new File(destinationDir)
		dir.mkdirs()
		def cssOut = new File("${destinationDir}/${libName}.css")
		for (def i = 0; i < fileNames.size(); i++) {
			def css = new File("${sourceDir}/${fileNames[i]}").getText('UTF-8')
			css = css.replaceAll(/[\n\r]+\s*/, '')
			css = css.replaceAll(/\s+/, ' ')
			css = css.replaceAll(/\s?([:,;{}])\s?/, '$1')
			css = css.replaceAll(/([\s:]0)(px|pt|%|em)/, '$1')
			css = css.replaceAll(/\/\*[\d\D]*?\*\//, '')
			cssOut.append(css)
			this.copySource(fileNames[i])
		}
		this.doTheme(cssOut)
	}
	void doTheme(def cssOut){ //ie does not support css variables
		if (this.themeFile != ''){
			def theme = new File("${sourceDir}/${themeFile}")
			theme.readLines().each{ line ->
				line = line.trim()
				if (line.indexOf('--') == 0){
					def var = 'var(' + line.substring(0, line.indexOf(':')).trim() + ')'		
					def val = line.substring(line.indexOf(':') + 1).trim()
					val = val.substring(0, val.lastIndexOf(';')).trim()
					ant.replace(file: cssOut, token: var, value: val)
				}
			}
			ant.replace(file: cssOut, token: '@import url("theme.css");', value: '')
			ant.copy(file: "${sourceDir}/${themeFile}", tofile: "${destinationDir}/../src/css/${themeFile}")
		}
	}
	void copySource(String file){
		def dir = Util.getDirectoryName("${destinationDir}/../src/css/${file}")
		new File(dir).mkdirs()
		ant.copy(file: "${sourceDir}/${file}", tofile: "${destinationDir}/../src/css/${file}")
	}
}

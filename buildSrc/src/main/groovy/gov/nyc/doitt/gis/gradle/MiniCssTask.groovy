package gov.nyc.doitt.nyc.gis.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

class MiniCssTask extends DefaultTask {
	def libName = ''
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
	}
	private void copySource(String file){
		ant.copy(file: "${sourceDir}/${file}", tofile: "${destinationDir}/../src/css/${file}")
	}
}

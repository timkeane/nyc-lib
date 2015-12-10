package gov.nyc.doitt.nyc.gis.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction
import org.apache.tools.ant.taskdefs.condition.Os

class JsDocTask extends DefaultTask {
	def jsdocDir = '../node_modules/.bin'
	def isWindows = Os.isFamily(Os.FAMILY_WINDOWS)
	def sourceDir = ''
	def destinationDir = ''
	def conf = ''
	def template = ''
	@TaskAction
	public void build(){
		def docs = new File(destinationDir)
		def exe = isWindows ? new File("${jsdocDir}/jsdoc.cmd") : new File("${jsdocDir}/jsdoc") 
		if (exe.exists()){
			if (conf != '') conf = "-c ${conf}"
			if (template != '') template = "-t ${template}"
			docs.mkdirs()
			def cmd = "${exe} ${sourceDir} -d ${destinationDir} -r ${conf} ${template} --verbose"
			def proc = cmd.execute()
			proc.waitForProcessOutput(System.out, System.err)
		}else{
			println '-------------------------------------------------------------------------'
			println	"	File '${cmd.getAbsolutePath()}' not found!"
			println	'	Install JsDoc (https://github.com/jsdoc3/jsdoc) or'
			println	"	set 'jsdocDir' property on task '${this.getName()}'."
			println	"	Skipping task '${this.getName()}'!"
			println '-------------------------------------------------------------------------'
		}
	}
}
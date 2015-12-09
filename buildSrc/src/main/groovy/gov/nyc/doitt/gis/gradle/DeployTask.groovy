package gov.nyc.doitt.nyc.gis.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

class DeployTask extends DefaultTask {
	def archiveName = ''
	def mobileDir = ''
	def archiveDir = ''
	def deployDir = ''
	def host = ''
	def user = ''
	@TaskAction
	public void deploy(){
		project.ssh.run {
	        session({
	        	host = this.host
	        	user = this.user
	        	identity = file("${System.properties['user.home']}/.ssh/id_rsa")
	        }) {
	        	execute "mkdir -p ${archiveDir}"
	        	execute "mkdir -p ${deployDir}"
	            put "build/distributions/${archiveName}", archiveDir
	            execute "cp -R ${deployDir} ${deployDir}.bak"
	            execute "rm -rf ${deployDir}"
	            execute "unzip ${archiveDir}/${archiveName} -d ${deployDir}"
	            execute "rm -rf ${deployDir}.bak"
	        }
	    }
    }
}
@Library(['piper-lib-os']) _
node() {
    stage('prepare') {
        deleteDir()
        checkout scm
        setupCommonPipelineEnvironment script:this
    }

    stage('build') {
        mtaBuild script: this
    }
    
    //stage ('build') {
    //    npmExecuteScripts script:this
    //}

    stage('SonarQube report') {
        withEnv(['JAVA_HOME=/var/jenkins_home/tools/hudson.model.JDK/jdk11/jdk-11']) {
            def scannerHome = tool 'cdctoolbox';
            withSonarQubeEnv('SAP SonarQube Enterprise') {
                sh "${scannerHome}/bin/sonar-scanner"
            }
        }
    }

    stage('Checkmarx report') {
        checkmarxExecuteScan script:this
    }

    //stage('deploy') {
    //    cloudFoundryDeploy script: this
    //}
}


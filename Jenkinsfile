@Library(['piper-lib-os']) _
node() {
    stage('prepare') {
        deleteDir()
        checkout scm
        setupCommonPipelineEnvironment script:this
    }

    stage('environment info') {
        sh 'env'
    }

    stage('build') {
        mtaBuild script: this
    }
    
    //stage ('build') {
    //    npmExecuteScripts script:this
    //}

    stage('SonarQube report') {
        def scannerHome = tool 'cdctoolbox';
        def nodeHome = tool 'nodejs16';
        withEnv(["JAVA_HOME=${JAVA_HOME}/jdk-11", "PATH=${nodeHome}/bin:${PATH}"]) {
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


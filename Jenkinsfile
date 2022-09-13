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
ß
    stage('Coverage') {
        dockerExecute(script: this, dockerImage: 'node:16') {
          script {
            sh 'node -v'
            sh "npm run test"
          }
        }
    }
    
    stage ('build') {
        npmExecuteScripts script:this
    }

    stage('SonarQube report') {
        def scannerHome = tool 'cdctoolbox';
        def nodeHome = tool 'nodejs16';
        withEnv(["JAVA_HOME=${JAVA_HOME}/jdk-11", "PATH=${nodeHome}/bin:${PATH}"]) {
            withSonarQubeEnv('SAP SonarQube Enterprise') {
                sh "${scannerHome}/bin/sonar-scanner"
            }
        }
    }

    stage("Check sonarQube result") {
        timeout(time: 30, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
    }

    stage('Checkmarx report') {
        checkmarxExecuteScan script:this
    }

    //stage('deploy') {
    //    cloudFoundryDeploy script: this
    //}
}


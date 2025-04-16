@Library(['piper-lib-os']) _
node() {
    properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '5', daysToKeepStr: '', numToKeepStr: '5']]]);

    stage('prepare') {
        deleteDir()
        checkout scm
        setupCommonPipelineEnvironment script:this
    }

    stage('environment info') {
        sh 'env'
    }

    stage ('tests') {
        dockerExecute(
            script: this,
            dockerImage: 'cypress/browsers:node-20.13.0-chrome-124.0.6367.155-1-ff-125.0.3-edge-124.0.2478.80-1',
        ) {
            sh '''chown -R root .
            npm install
            npm install start-server-and-test
            npm run test
            npm run cypress:ci
            '''
        }
        //publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'coverage/unit/lcov-report', reportFiles: 'index.html', reportName: 'Unit test coverage report'])
        //publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'coverage/cypress/lcov-report', reportFiles: 'index.html', reportName: 'End to end test coverage report'])
    }


    stage('SonarQube report') {
        def scannerHome = tool 'cdc-tools-chrome-extension';
        def nodeHome = tool 'nodejs16';
        withEnv(["PATH=${nodeHome}/bin:${PATH}"]) {
            withSonarQubeEnv('cdc-tools-chrome-extension') {
                sh "${scannerHome}/bin/sonar-scanner"
            }
        }
    }

    stage("SonarQube result") {
        timeout(time: 30, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true,
            credentialsId:"cdc-tools-chrome-extension-sonar"
        }
    }

    stage('Mend/Whitesource report') {
        whitesourceExecuteScan script: this
    }

    stage('Checkmarx report') {
        checkmarxExecuteScan script:this
    }

}

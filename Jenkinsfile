@Library(['piper-lib-os']) _
node() {
    properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '10', daysToKeepStr: '', numToKeepStr: '10']]]);

    stage('prepare') {
        deleteDir()
        checkout scm
        setupCommonPipelineEnvironment script:this
    }

    stage('environment info') {
        sh 'env'
    }

    stage ('test') {
        withEnv(["CYPRESS_CACHE_FOLDER=/tmp/app/.cache", "BROWSER=none"]) {
        sh "mkdir -p ${CYPRESS_CACHE_FOLDER}"
        npmExecuteScripts script:this, 
                          runScripts: ["test"],
                          verbose: true
        }
        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'Test coverage report'])
    }
    
    // stage ('cypress') {
    //     withEnv(["CYPRESS_CACHE_FOLDER=/tmp/app/.cache", "BROWSER=none"]) {
    //     sh "mkdir -p ${CYPRESS_CACHE_FOLDER}"
    //     npmExecuteScripts script:this, 
    //                       runScripts: ["cypress:ci"],
    //                       verbose: true
    //     }
    // }

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

    //archive (includes: 'build/static/**/main.*')
}
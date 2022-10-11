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

    stage ('test') {
        withEnv(["CYPRESS_CACHE_FOLDER=/tmp/app/.cache", "BROWSER=none"]) {
        sh "mkdir -p ${CYPRESS_CACHE_FOLDER}"
        npmExecuteScripts script:this, 
                          runScripts: ["test"],
                          verbose: true
                }
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
        def scannerHome = tool 'cdctoolbox';
        def nodeHome = tool 'nodejs16';
        withEnv(["JAVA_HOME=${JAVA_HOME}/jdk-11", "PATH=${nodeHome}/bin:${PATH}"]) {
            withSonarQubeEnv('SAP SonarQube Enterprise') {
                sh "${scannerHome}/bin/sonar-scanner"
            }
        }
    }

    // stage("Check sonarQube result") {
    //     timeout(time: 30, unit: 'MINUTES') {
    //       waitForQualityGate abortPipeline: true
    //     }
    // }

    stage('Checkmarx report') {
        checkmarxExecuteScan script:this
    }
}


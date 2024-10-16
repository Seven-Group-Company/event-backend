pipeline {
    agent {
        label 'win-agent'
    }
    triggers {
        pollSCM '* * * * *'
    }
    environment {
      scannerHome = tool name: 'sonarscanner'
      EC2_INSTANCE_IP = '18.224.247.241'
      SSH_KEY_ID = 'sgc_ssh_pk'
      SSH_USER = 'ubuntu'
    }
    stages {
        stage('Install Packages') {
      steps {
        echo 'Install Dependencies'
        sh 'npm install'
      }
        }

        stage('Test') {
      steps {
        sh 'ls'
      }
        }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonarqube_server') {
          bat "${scannerHome}\\bin\\sonar-scanner"
        }
      }
    }

    stage('CleanUp WS') {
      steps {
        cleanWs()
      }
    }
    }
}

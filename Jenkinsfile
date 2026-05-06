pipeline {
    agent any

    stages {
        stage('Clone Code') {
            steps {
                git url: 'https://github.com/Shiva-m87/study-verse.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t study-verse .'
            }
        }

        stage('Clean Old Container') {
            steps {
                bat 'docker rm -f study-verse-container || exit 0'
            }
        }

        stage('Deploy Container') {
            steps {
                bat 'docker run -d --name study-verse-container -p 3000:80 study-verse'
                                                                        // ^^^^^^^^
                                                                        // 80 not 3000
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl -f http://localhost:3000 || exit 1'
            }
        }
    }
}

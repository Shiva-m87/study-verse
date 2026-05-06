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

        stage('Save Docker Image') {
            steps {
                bat 'docker save -o study-verse.tar study-verse'
            }
        }

        stage('Copy Image to EC2') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'ec2',
                            failOnError: false,
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'study-verse.tar',
                                    removePrefix: '',
                                    remoteDirectory: ''
                                )
                            ]
                        )
                    ]
                )
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'ec2',
                            failOnError: false,
                            transfers: [
                                sshTransfer(
                                    execCommand: 'docker rm -f study-verse-container; docker load -i /home/ubuntu/study-verse.tar; docker run -d -p 80:80 --name study-verse-container study-verse'
                                )
                            ]
                        )
                    ]
                )
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl http://32.194.90.209:80'
            }
        }
    }
}

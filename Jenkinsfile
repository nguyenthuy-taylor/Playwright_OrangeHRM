pipeline {
    agent any

    parameters {
        choice(
            name: 'TARGET_ENV',
            choices: ['local', 'staging', 'prod'],
            description: 'Select environment to run test'
        )
    }

    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        PLAYWRIGHT_BROWSERS_PATH = '0'
        PATH = "${env.PATH};C:\\Users\\admin\\AppData\\Roaming\\npm"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat '''
                    set PLAYWRIGHT_BROWSERS_PATH=0
                    npx playwright install
                '''
            }
        }

        stage('Run Regression Tests') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    script {
                        def url = ''
                        if (params.TARGET_ENV == 'local') {
                            url = 'http://localhost/orangehrm/web/index.php/auth/login'
                        } else if (params.TARGET_ENV == 'staging') {
                            url = 'http://staging-server.company.com'
                        } else {
                            url = 'http://prod-server.company.com'
                        }

                        bat "npx cross-env BASE_URL=${url} npm run regression"
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'npx allure generate allure-results --clean -o allure-report'
                bat 'dir allure-report'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**, allure-results/**, allure-report/**', allowEmptyArchive: true

            // Allure Jenkins Plugin (trỏ đúng "Name" trong Global Tool Configuration)
            allure([
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']],
                commandline: 'allure',   // <-- Name đã khai báo trong Jenkins Global Tool Configuration
                reportBuildPolicy: 'ALWAYS'
            ])
        }
    }
}

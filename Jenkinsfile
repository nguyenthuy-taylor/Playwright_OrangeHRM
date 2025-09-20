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
        // Thêm đường dẫn allure npm vào PATH để plugin Jenkins nhận
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
                // catchError để pipeline tiếp tục chạy nếu có test fail
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
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

        stage('Publish Report') {
            steps {
                // Lưu artifact Playwright + Allure
                archiveArtifacts artifacts: 'playwright-report/**, allure-results/**', allowEmptyArchive: true

                // Tạo Allure report
                allure([
                    includeProperties: false,
                    results: [[path: 'allure-results']],
                    reportBuildPolicy: 'ALWAYS'
                ])
            }
        }
    }

    post {
        always {
            // Đảm bảo artifact được lưu ngay cả khi stage thất bại
            archiveArtifacts artifacts: 'playwright-report/**, allure-results/**', allowEmptyArchive: true
        }
    }
}

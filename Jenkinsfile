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
        // Dùng chính NodeJS từ Jenkins, cộng thêm npm binaries
        PATH = "${tool 'NodeJS 18'}\\node_modules\\.bin;${env.PATH}"
        PLAYWRIGHT_BROWSERS_PATH = '0'
    }

    stages {
        stage('Check Node & NPM') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // Không cần set lại biến, đã khai báo trong environment
                bat 'npx playwright install'
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
                // Tạo report HTML
                bat 'npx allure generate allure-results --clean -o allure-report'
                
                // Kiểm tra nội dung thư mục
                bat 'dir allure-report'
            }
        }
    }

    post {
        always {
            // Lưu artifact
            archiveArtifacts artifacts: 'playwright-report/**, allure-results/**, allure-report/**', allowEmptyArchive: true

            // Hiển thị Allure report trên Jenkins bằng plugin
            allure([
                results: [[path: 'allure-results']],
                reportBuildPolicy: 'ALWAYS'
            ])
        }
    }
}

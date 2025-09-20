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
        PATH = "${env.PATH};C:\\Users\\admin\\AppData\\Roaming\\npm" // để npx allure chạy được
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
        // catchError để test fail không dừng pipeline
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
        // Tạo report HTML từ kết quả allure-results
        bat 'npx allure generate allure-results --clean -o allure-report'

        // Kiểm tra nội dung thư mục
        bat 'dir allure-report'
      }
    }

        stage('Publish Allure HTML Report') {
      steps {
        // Dùng HTML Publisher để mở trực tiếp trên Jenkins
        publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    reportName: 'Allure Report'
                ])
      }
        }
    }

    post {
        always {
      // Lưu Playwright + Allure report
      archiveArtifacts artifacts: 'playwright-report/**, allure-results/**, allure-report/**', allowEmptyArchive: true
        }
    }
}

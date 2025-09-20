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

    stage('Publish HTML Report') {
      steps {
        archiveArtifacts artifacts: 'playwright-report/**, allure-results/**', allowEmptyArchive: true
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, allure-results/**', allowEmptyArchive: true
    }
  }
}

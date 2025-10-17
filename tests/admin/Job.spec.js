import { testDB as test } from '../../fixtures/testDataFixture.js';
import { mainNavigationOption } from '../../helper/mainNavigationOption.js';
import { navigateToJobItem } from '../../helper/navigation/AdminSubNavigationManager.js';
import { navigateMainMenuItem } from '../../helper/navigation/MainNavigationManager.js';
import { NotificationHelper } from '../../helper/NotificationHelper.js';
// import everything from allure-js-commons as allure
import * as allure from 'allure-js-commons'; // ✅ sửa dòng này

const uploadFileInput = 'uploadFiles/myInfoTestingFiles/automation_testing_download.xlsx';
let jobTitle;
let jobTitlePage;

test.beforeEach(async ({ loggedInPage }) => {
  await navigateMainMenuItem(loggedInPage, mainNavigationOption.ADMIN);
  jobTitlePage = await navigateToJobItem(loggedInPage, 'Job', 'Job Titles');
});

test.describe('🧾 Job Titles Management', () => {

  test('[@Regression] TC_001: Create Job Titles', async ({ loggedInPage }) => {
    // 🧩 Gán metadata cho Allure
    allure.epic('Admin');
    allure.feature('Job Management');
    allure.story('Create Job Title');
    allure.owner('Thuy');
    allure.severity('critical');

    jobTitle = `Automation QA_${Date.now()}`;

    await test.step('Create new job title', async () => {
      await jobTitlePage.addJobTitle(
        jobTitle,
        'This is a job description for Automation Test Job Title',
        'This is a job note',
        uploadFileInput
      );
    });

    await test.step('Wait for notification loading', async () => {
      await NotificationHelper.isLoadingPresent(loggedInPage);
      await NotificationHelper.isLoadingFired(loggedInPage);
    });

    allure.attachment('Created Job Title', jobTitle, 'text/plain');
  });


  test('[@Regression] TC_002: Edit Job Titles', async ({ loggedInPage }) => {
    allure.epic('Admin');
    allure.feature('Job Management');
    allure.story('Edit Job Title');
    allure.owner('Thuy');
    allure.severity('normal');

    const oldJobTitle = 'Automation QA_1759740683058';
    const newJobTitle = `Edited_${jobTitle}`;

    await test.step(`Edit job title from ${oldJobTitle} → ${newJobTitle}`, async () => {
      await jobTitlePage.editJobTitle(oldJobTitle, newJobTitle);
    });

    await test.step('Wait for notification loading', async () => {
      await NotificationHelper.isLoadingPresent(loggedInPage);
      await NotificationHelper.isLoadingFired(loggedInPage);
    });

    allure.attachment('Edited Job Title', newJobTitle, 'text/plain');
  });


  test('[@Regression] TC_003: Delete A Job Titles', async ({ loggedInPage }) => {
    allure.epic('Admin');
    allure.feature('Job Management');
    allure.story('Delete Job Title');
    allure.owner('Thuy');
    allure.severity('minor');

    const deletedJob = 'Automation QA_1759752880455';

    await test.step(`Delete job title: ${deletedJob}`, async () => {
      await jobTitlePage.deleteJobTitle(deletedJob);
    });

    await test.step('Wait for notification loading', async () => {
      await NotificationHelper.isLoadingPresent(loggedInPage);
      await NotificationHelper.isLoadingFired(loggedInPage);
    });

    allure.attachment('Deleted Job Title', deletedJob, 'text/plain');
  });
  

});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await attachment('Failure Screenshot', await page.screenshot(), 'image/png');
    await attachment('Trace', JSON.stringify(testInfo, null, 2), 'application/json');
  }
});


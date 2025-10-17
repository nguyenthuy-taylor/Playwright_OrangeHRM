import { My_Test as test } from '../../fixtures/My_Test';

import { navigateMainMenuItem } from '../../helper/navigation/MainNavigationManager';
import { navigateToPIMPageMenuItem } from '../../helper/navigation/PIMSubNavigationManager';

import { mainNavigationOption } from '../../helper/mainNavigationOption';
import * as allure from 'allure-js-commons'; // ✅ sửa dòng này

const eventName = 'Accommodation';

test.describe('[@regression] Employee Claims', () => {
    test('TC_001: Search Employee Claims successfully', async ({ loggedInPage }) => {
        allure.epic(' CLAIMS');
        allure.feature('Employee Claims');
        allure.story('Search for a Claims');
        allure.owner('Thuy');
        allure.severity('critical');
        let employeeClaimsPage; // ✅ khai báo ngoài step

        await test.step('Navigate to Employee Claims page', async () => {
            employeeClaimsPage = await navigateMainMenuItem(loggedInPage, mainNavigationOption.CLAIM);
        });

        await test.step('Select Event name in the dropdown', async () => {
            await employeeClaimsPage.selectEvenNameItem(eventName);
        });
        await test.step('Select From Date value', async () => {
            await employeeClaimsPage.selectFromDate(2025, 'July', 30)
        });
        await test.step('Click to Search button to search for a claim', async () => {
            await employeeClaimsPage.clickToSearchButton();
        });

    });


    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        await attachment('Failure Screenshot', await page.screenshot(), 'image/png');
        await attachment('Trace', JSON.stringify(testInfo, null, 2), 'application/json');
      }
    });
})

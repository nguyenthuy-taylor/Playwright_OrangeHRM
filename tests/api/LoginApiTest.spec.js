import { apiTest as test } from '../../fixtures/apiFixture'
import { expect } from '@playwright/test'
import { uiTest as uiTest } from '../../fixtures/UI_Fixture';
import { E_HomeDashboardPage } from '../../page_objects/ecommercePO/E_HomeDashboardPage';


test('TC001: Check admin API', async ({ adminApiLogin }) => {
    console.log(adminApiLogin.token);   // lấy token
    console.log(adminApiLogin.userId);  // lấy userId
});


uiTest('TC002: Access dashboard after login via API', async ({ loggedInPage }) => {
    await expect(loggedInPage).toHaveURL(/dashboard\/.*/)
});

uiTest('TC003: Practice Intercept functionality in playwright ', async ({ loggedInPage }) => {
    await expect(loggedInPage).toHaveURL(/dashboard\/.*/)
    const dashboardPage = await new E_HomeDashboardPage(loggedInPage);
    await dashboardPage.navigateToMyOrders();
    await dashboardPage.fakeUnathorizedOrderWithFullfill('620c7bf148767f1f1215d2ca');
    await expect(loggedInPage.locator("p").last()).toHaveText("You are not authorize to view this order");
});

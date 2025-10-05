import { test as baseTest, chromium } from '@playwright/test';

export const My_Test = baseTest.extend({
    loggedInPage: async ({ }, use) => {
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext({
            storageState: 'storage/state.json'
        });
        const page = await context.newPage();
        await page.goto('http://localhost/orangehrm/web/index.php/dashboard/index');
        await page.waitForLoadState('networkidle');
        await use(page);
        await browser.close();
    },
    apiContext: async ({ playwright }, use) => {
        const apiContext = await request.newContext({
            baseURL: 'https://reqres.in'
        });
        await use(apiContext);
        await apiContext.dispose();
    },
    userApi: async ({ apiContext }, use) => {
        await use(new UserApi(apiContext));
    }

});

export { expect } from '@playwright/test';



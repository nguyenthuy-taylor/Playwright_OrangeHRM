import { test as base } from '@playwright/test';
import { apiTest } from './apiFixture'

export const uiTest = apiTest.extend({
    loggedInPage: async ({ browser, adminApiLogin }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // inject token để bypass login
        await page.addInitScript(token => {
            window.localStorage.setItem('token', token);
        }, adminApiLogin.token);

        await page.goto('https://rahulshettyacademy.com/client/');
        await use(page);

        await context.close();
    }

})
export { expect } from '@playwright/test';
import { test as base, chromium } from '@playwright/test';
import { getDBConnection } from '../utils/db.js';
import { describe } from 'node:test';

export const testDB = base.extend({
    testEvent: async ({ }, use) => {
        const connection = await getDBConnection();
        // create event test
        const uniqueName = `Service_${Date.now()}`;
        const [result] = await connection.execute(`INSERT INTO ohrm_claim_event (name, description) VALUES (?, ?)`
            , [uniqueName, 'Event is added with DB']);


        const eventId = result.insertId;

        // Pass event data to the test
        await use({ id: eventId, name: uniqueName, description: 'Event is added with DB' });

        // clean data after test
        await connection.execute(`DELETE FROM ohrm_claim_event WHERE id = ?`, [eventId]);
        await connection.end();
    },
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
    }


})
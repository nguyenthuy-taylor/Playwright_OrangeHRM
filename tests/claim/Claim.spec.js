import { My_Test as test } from '../../fixtures/My_Test';
import { testDB } from '../../fixtures/testDataFixture.js';

import { navigateMainMenuItem } from '../../helper/navigation/MainNavigationManager';
import { navigateToClaimConfigurationPageMenuItem } from '../../helper/navigation/ClaimSubNavigationManager';

import { mainNavigationOption } from '../../helper/mainNavigationOption';
import { claimMenuItems } from '../../helper/menuItems/claimMenuItems.js';


test.describe(' Employee Claims', () => {
    test('[@regression] TC_001: Add an Event successfully', async ({ loggedInPage }) => {
        await navigateMainMenuItem(loggedInPage, mainNavigationOption.CLAIM);
        const configurationPage = await navigateToClaimConfigurationPageMenuItem(loggedInPage, claimMenuItems.CONFIGURATION_EVENTS);
        await configurationPage.addNewEvent('Accommodation', 'This is a test event description created by automation!!!');
        await loggedInPage.waitForTimeout(2000);
    }),
        testDB.only('[@Smoke] TC_002: Add an Event through DB', async ({ loggedInPage, testEvent }) => {
            console.log(testEvent);

            await navigateMainMenuItem(loggedInPage, mainNavigationOption.CLAIM);
            const configurationPage = await navigateToClaimConfigurationPageMenuItem(loggedInPage, claimMenuItems.CONFIGURATION_EVENTS);
            await configurationPage.addNewEvent(testEvent.name, testEvent.description);
            await loggedInPage.waitForTimeout(2000);
        })

})
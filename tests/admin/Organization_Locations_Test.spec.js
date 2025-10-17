import { My_Test as test } from "../../fixtures/My_Test";
import { expect } from '@playwright/test';
import { navigateMainMenuItem } from "../../helper/navigation/MainNavigationManager";
import { navigateToMenu } from "../../helper/navigation/navigationHelper";
import { LocationsPage } from "../../page_objects/admin/LocationsPage";
import { logInfo, logWarn } from "../../utils/logger";
import * as allure from 'allure-js-commons';
import { logStep, addMeta } from "../../helper/allureHelper";

let location;

test.beforeEach(async ({ loggedInPage }) => {
    await navigateMainMenuItem(loggedInPage, 'Admin');
    location = await navigateToMenu(loggedInPage, 'Organization', 'Locations', '//a[@role="menuitem"]', LocationsPage);
});

test.describe('📍Locations', () => {

    test('[@Regression] TC_001: Search for Location', async ({ loggedInPage }) => {
        addMeta({
            epic: 'Admin',
            feature: 'Organization',
            story: 'Locations',
            owner: 'Taylor Nguyen',
            severity: 'normal',
        });

        await logStep(loggedInPage, 'Navigate to Admin → Organization → Locations', async () => {
            await location.searchForLocation('Taylor Swift', 'New York');
        });


    });

    test('[@Regression] TC_002: Add a Location', async ({ loggedInPage }) => {
        addMeta({
            epic: 'Admin',
            feature: 'Organization',
            story: 'Locations',
            owner: 'Taylor Nguyen',
            severity: 'normal',
        });

        await logStep(loggedInPage, 'Navigate to Admin → Organization → Locations', async () => {
            await location.clickToAddLocation();
            await location.addLocation({
                name: 'Taylor Swift', city: 'New York', stateProvince: 'New York', zipPostalCode: '10001', countryName: 'United States', phone: '1234567890', fax: '0987654321', address: '123 Main St, New York, NY', notes: 'This is a test location.'
            });
        });
    });
});

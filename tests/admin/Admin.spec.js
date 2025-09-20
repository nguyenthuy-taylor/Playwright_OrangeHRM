import { My_Test as test } from '../../fixtures/My_Test';
import { expect } from '@playwright/test';
import { userManagamentDropdownItems } from '../../helper/menuItems/adminMenuItems';
import { navigateToUserManagementItem } from '../../helper/navigation/AdminSubNavigationManager';
import { navigateMainMenuItem } from '../../helper/navigation/MainNavigationManager';
import { mainNavigationOption } from '../../helper/mainNavigationOption';
import { NotificationHelper } from '../../helper/NotificationHelper';
import { setupTestUser } from '../../services/userService';

const userRole = ['Admin', 'ESS'];
let newUserData;
test.describe('Admin Page Tests', () => {
    test.beforeAll(async ({ loggedInPage }) => {
        newUserData = await setupTestUser(loggedInPage);
    });

    test('[@regression] TC_001: Search System Users with records returns', async ({ loggedInPage }) => {
        await navigateMainMenuItem(loggedInPage, mainNavigationOption.ADMIN);
        const userManagementPage = await navigateToUserManagementItem(loggedInPage, 'User Management', userManagamentDropdownItems.USERS);
        await userManagementPage.selectUserRoleOption(userRole[0]);
        await userManagementPage.page.waitForTimeout(2000);
        await userManagementPage.searchAndSelectAnEmployeeName('chung', 'chung thuy failed')
        await userManagementPage.clickToSearchButton();
        expect(await NotificationHelper.isLoadingFired(loggedInPage)).toBeTruthy();
        await userManagementPage.verifyReturnResults(newUserData.userName, newUserData.userRole, newUserData.employeeName, newUserData.status)
    });
});



test('[@smoke] TC_00: Add a new System Users', async ({ loggedInPage }) => {
    await setupTestUser(loggedInPage);
});


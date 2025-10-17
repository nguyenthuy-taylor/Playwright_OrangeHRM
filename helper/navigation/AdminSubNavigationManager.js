import { time } from 'console';
import { UserManagementPage } from '../../page_objects/admin/UserManagementPage';
import { JobTitlesPage } from '../../page_objects/admin/JobTitlesPage';
import { expect } from '@playwright/test';


/** 🧠 1. Mục tiêu của hàm
 - Tìm và nhấn vào một mục chính trong menu (ví dụ: “User Management”) → Mở ra menu con.
 - Tìm và nhấn vào mục con trong menu dropdown (nếu có childItemName).
 - Xử lý các trường hợp locator khó bắt, nhiều bản sao hoặc không khớp chính xác → dùng lọc nâng cao + fallback thủ công.
 - Có log rõ ràng để debug khi locator không tìm thấy. */

export async function navigateToUserManagementItem(page, menuItemName = 'User Management', childItemName) {
    const locatorXPath = `//span[normalize-space()='${menuItemName}']`;
    const menuItems = page.locator(locatorXPath);
    const filteredItem = menuItems.filter({ hasText: new RegExp(`^${menuItemName}$`, 'i') }).first();

    if (await filteredItem.count() > 0) {
        console.log(`[INFO] Found "${menuItemName}" using filter. Clicking...`);
        await filteredItem.click();
    } else {
        console.warn(`[WARN] Filtered locator not found. Falling back to manual search...`);
        const itemCount = await menuItems.count();
        let found = false;

        for (let i = 0; i < itemCount; i++) {
            const text = (await menuItems.nth(i).textContent())?.trim().toLowerCase();
            if (text === menuItemName.toLowerCase()) {
                console.log(`[INFO] Found "${menuItemName}" at index ${i}. Clicking...`);
                await menuItems.nth(i).click();
                found = true;
                break;
            }
        }

        if (!found) {
            console.error(`[ERROR] Could not find "${menuItemName}" using fallback method.`);
        }
    }

    const childItems = await page.locator('ul.oxd-dropdown-menu a');
    await childItems.first().waitFor({ state: 'visible', timeout: 3000 });
    const childCount = await childItems.count();
    if (childCount > 0 && childItemName) {
        const childLocator = childItems.filter({ hasText: new RegExp(`^${childItemName}$`, 'i') }).first();
        if (await childLocator.count() > 0) {
            console.log(`[INFO] Found "${childItemName}" in user management. Clicking...`);
            await childLocator.click();
            await page.waitForLoadState('networkidle');
            return new UserManagementPage(page);
        } else {
            console.warn(`[WARN] Child item "${childItemName}" not found.`);
        }
    }
}


export async function navigateToJobItem(page, menuItemName, childItemName) {
    const locatorXPath = `//span[normalize-space()='${menuItemName}']`;
    const menuItems = page.locator(locatorXPath);
    const filteredItem = menuItems.filter({ hasText: new RegExp(`^${menuItemName}$`, 'i') }).first();
    if (await filteredItem.count() > 0) {
        console.log(`[INFO] Found "${menuItemName}" using filter. Clicking...`);
        await filteredItem.click();

    } else {
        console.warn(`[WARN] Filtered locator not found. Falling back to manual search...`);
        const itemCount = await menuItems.count();
        let found = false;

        for (let i = 0; i < itemCount; i++) {
            const text = (await menuItems.nth(i).textContent())?.trim().toLowerCase();
            if (text === menuItemName.toLowerCase()) {
                console.log(`[INFO] Found "${menuItemName}" at index ${i}. Clicking...`);
                await menuItems.nth(i).click();
                found = true;
                break;
            }
        }
        if (!found) {
            console.error(`[ERROR] Could not find "${menuItemName}" using fallback method.`);
        }

        const childItems = await page.locator('a[role="menuitem"]');
        await childItems.first().waitFor({ state: 'visible', timeout: 3000 });
        const itemsCount = await childItems.count();
        if (itemsCount > 0 && childItemName) {
            const childLocator = childItems.filter({ hasText: new RegExp(`^${childItemName}$`, 'i') }).first();
            if (await childLocator.count() > 0) {
                console.log(`[INFO] Found "${childItemName}" in Job Titles menu. Clicking...`);
                await childLocator.click();
                await page.waitForLoadState('networkidle');
                return new JobTitlesPage(page);
            } else {
                console.warn(`[WARN] Child item "${childItemName}" not found.`);
            }
        }

    }

}
export async function navigateToOrganizationItem(page, menuItemName) {
    const orgLocator = page.locator("//span[normalize-space()='Organization']");
    await orgLocator.waitFor({ state: 'visible' });
    await orgLocator.click();

    const menuItems = page.locator("//span[normalize-space()='Organization']/following-sibling::ul//a");
    const filtered = menuItems.filter({ hasText: new RegExp(`^${menuItemName}$`, 'i') });
    const count = await filtered.count();

    if (count > 0) {
        console.log(`[INFO] Found "${menuItemName}" using filter. Clicking...`);
        await filtered.first().click();
        return;
    }

    console.warn(`[WARN] Filtered locator not found. Falling back to manual search...`);
    const itemCount = await menuItems.count();
    let found = false;

    for (let i = 0; i < itemCount; i++) {
        const text = (await menuItems.nth(i).textContent())?.trim().toLowerCase();
        if (text === menuItemName.toLowerCase()) {
            console.log(`[INFO] Found "${menuItemName}" at index ${i}. Clicking...`);
            await menuItems.nth(i).click();
            found = true;
            break;
        }
    }

    if (!found) {
        console.error(`[ERROR] Could not find "${menuItemName}" using fallback method.`);
        expect.soft(found, `[ERROR] Could not find "${menuItemName}" in Organization menu`);
    }

}

export async function navigateToQualificationsItem(page, menuItemName) {
    const qualificationLocator = page.locator("//span[normalize-space()='Qualifications']");

}
export async function navigateToConfigurationItem(page, menuItemName) {

}
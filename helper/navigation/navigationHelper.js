import { expect } from '@playwright/test';
import { logError, logInfo, logWarn } from '../../utils/logger.js';

/**
 * 🧭 navigateToMenu — điều hướng chung cho các menu có dạng main → child.
 * Tự động log Allure, retry click nếu cần, và chờ load state ổn định.
 */

export async function navigateToMenu(page, mainItemName, childMenuName, childSelector = '//a[@role="menuitem"]', PageObjectClass) {
    const mainMenuXpath = `//span[normalize-space()='${mainItemName}']`;
    await findAndClickMenuItem(page, mainMenuXpath, mainItemName);

    if (childMenuName) {
        await findAndClickMenuItem(page, childSelector, childMenuName);
    }

    if(PageObjectClass) {
        await page.waitForLoadState('networkidle');
        return new PageObjectClass(page);
    }

}

export async function findAndClickMenuItem(page, selectorOrXPath, itemName, maxRetry = 2) {
    const isXPath = selectorOrXPath.startsWith('//') ? page.locator(selectorOrXPath) : page.locator(selectorOrXPath);
    const locator = page.locator(selectorOrXPath);

    for (let attempt = 1; attempt <= maxRetry; attempt++) {
        try {
            await locator.first().waitFor({ state: 'visible', timeout: 5000 });

            // 🎯 1. Filter chính xác
            const filtered = locator.filter({ hasText: new RegExp(`^${itemName}$`, 'i') }).first();
            if (await filtered.count() > 0) {
                logInfo(`[INFO] Found "${itemName}" via filter → clicking...`);
                await filtered.click();
                return true;
            }

            // 🩹 2. Fallback: tìm gần đúng
            logWarn(`[WARN] Filter not found → fallback for "${itemName}" (attempt ${attempt})`);
            const count = await locator.count();
            let found = false;

            for (let i = 0; i < count; i++) {
                const text = (await locator.nth(i).textContent())?.trim().toLowerCase();
                if (text === itemName.toLowerCase()) {
                    logInfo(`[INFO] Found "${itemName}" at index ${i} → clicking.`);
                    await locator.nth(i).click();
                    found = true;
                    break;
                }
            }

            if (!found) {
                logError(`[ERROR] Could not find "${itemName}".`);
                expect.soft(false, `[ERROR] Could not find "${itemName}"`);
            }

            return found;
        } catch (err) {
            logWarn(`[WARN] Attempt ${attempt} failed: ${err.message}`);
            if (attempt === maxRetry) throw err;
        }
    }
}
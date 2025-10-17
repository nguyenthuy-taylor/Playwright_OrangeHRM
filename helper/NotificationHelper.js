import { logInfo, logError, logWarn } from "../utils/logger";

export class NotificationHelper {
    static successMessage = '.oxd-toast--success';
    static loadingIcon = '.oxd-loading-spinner';
    static noRecordFoundInfoMsg = "//div[contains(@class, 'oxd-toast-content--info')]//p[normalize-space()='No Records Found']";

    // Kiểm tra message thành công có hiển thị không
    static async isSuccessMessageDisplayed(page) {
        return await page.locator(NotificationHelper.successMessage).isVisible();
    }

    // Kiểm tra loading icon
    static async isLoadingFired(page) {
        const loadingIconList = await page.locator(NotificationHelper.loadingIcon).all();
        if (loadingIconList.length === 0) {
            console.log('Không có loading icon nào.');
            return true;
        }
        for (let i = 0; i < loadingIconList.length; i++) {
            await loadingIconList[i].waitFor({ state: 'detached' });
        }
        return true;
    }

    static async waitForLoading(page, appearTimeout = 2000, disappearTimeout = 5000) {
        const loadingIcon = page.locator(NotificationHelper.loadingIcon);
        try {
            // 1️⃣ Chờ loading xuất hiện (nếu không xuất hiện thì tiếp tục luôn)
            await loadingIcon.waitFor({ state: 'visible', timeout: appearTimeout });
            logInfo('[INFO] Loading icon đã hiển thị.');
        } catch {
            logInfo('[INFO] Loading icon không xuất hiện, bỏ qua bước chờ hiển thị.');
        }

        try {
            // 2️⃣ Chờ loading biến mất
            await loadingIcon.waitFor({ state: 'detached', timeout: disappearTimeout });
            logInfo('[INFO] Loading icon đã biến mất.');
        } catch {
            logWarn('[WARN] Loading icon vẫn còn sau thời gian chờ.');
        }
    }

    static async isNoRecordFoundInfoDisplay(page) {
        return await page.locator(NotificationHelper.noRecordFoundInfoMsg).isVisible();
    }
}
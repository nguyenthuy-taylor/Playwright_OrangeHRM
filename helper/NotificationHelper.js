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

    static async isLoadingPresent(page, timeout = 3000) {
        const loadingIcon = page.locator(NotificationHelper.loadingIcon);
        try {
            await loadingIcon.waitFor({ state: 'visible', timeout });
            console.log('[INFO] Loading icon đã hiển thị.');
            return true; // Loading icon đã xuất hiện
        } catch (error) {
            console.error('[WARN] Loading icon chưa hiển thị sau thời gian chờ:', error);
            return false; // Loading icon vẫn còn hiển thị sau thời gian chờ
        }
    }

    static async isNoRecordFoundInfoDisplay(page) {
        return await page.locator(NotificationHelper.noRecordFoundInfoMsg).isVisible();
    }
}
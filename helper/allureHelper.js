import {
    step as allureStep,
    attachment as allureAttachment,
    label as allureLabel,
    LabelName,
    Severity
} from 'allure-js-commons';

/**
 * 🪜 Thực thi 1 step có log Allure + tự attach screenshot nếu fail
 * @param {Page} page - Playwright Page
 * @param {string} stepName - Tên step hiển thị trong Allure Report
 * @param {Function} action - Hàm async cần thực thi
 */
export async function logStep(page, stepName, action) {
    await allureStep(stepName, async () => {
        console.log(`🪜 Step: ${stepName}`);
        try {
            await action();
            console.log(`✅ Step passed: ${stepName}`);
        } catch (error) {
            console.error(`❌ Step failed: ${stepName}`, error);

            const screenshot = await page.screenshot({ fullPage: true });
            await allureAttachment('Error Screenshot', screenshot, 'image/png');
            allureAttachment('Error Log', error.stack || error.message, 'text/plain');

            throw error;
        }
    });
}

/**
 * 🏷️ Gắn metadata (epic, feature, story, owner, severity, ...)
 */
export function addMeta({ epic, feature, story, owner, severity }) {
    if (epic) allureLabel(LabelName.EPIC, epic);
    if (feature) allureLabel(LabelName.FEATURE, feature);
    if (story) allureLabel(LabelName.STORY, story);
    if (owner) allureLabel(LabelName.OWNER, owner);

    if (severity) {
        const sev = severity.toLowerCase?.() || severity;
        switch (sev) {
            case 'blocker':
                allureLabel(LabelName.SEVERITY, Severity.BLOCKER);
                break;
            case 'critical':
                allureLabel(LabelName.SEVERITY, Severity.CRITICAL);
                break;
            case 'normal':
                allureLabel(LabelName.SEVERITY, Severity.NORMAL);
                break;
            case 'minor':
                allureLabel(LabelName.SEVERITY, Severity.MINOR);
                break;
            case 'trivial':
                allureLabel(LabelName.SEVERITY, Severity.TRIVIAL);
                break;
            default:
                allureLabel(LabelName.SEVERITY, sev);
        }
    }
}

/**
 * 📸 Gắn screenshot thủ công
 */
export async function attachScreenshot(page, name = 'Screenshot') {
    const screenshot = await page.screenshot({ fullPage: true });
    await allureAttachment(name, screenshot, 'image/png');
}

/**
 * 🧾 Gắn text/file vào Allure Report
 */
export function addAttachment(name, content, type = 'text/plain') {
    allureAttachment(name, content, type);
}

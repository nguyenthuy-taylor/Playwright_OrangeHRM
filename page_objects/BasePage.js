export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async getElementText(selector) {
        await this.page.locator(selector).textContent();
    }

    async getTextOfListElements(selector) {
        const allElements = await this.page.locator(selector).all();
        const allElementsText = await allElements.allTextContents();
        return await allElementsText.map(m => m.trim());
    }

    async scrollToElement(selector) {
        await this.page.waitForSelector(selector).hover();
        await this.page.mouse.wheel(0, 10);
    }

    async selectDate(expectedYear, expectedMonth, expectedDate) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let tries = 0;
        const maxTries = 24;



        while (tries < maxTries) {
            const actualMonthText = (await this.page.locator('div.oxd-calendar-selector-month-selected>p').textContent()).trim();
            const actualYearText = (await this.page.locator('div.oxd-calendar-selector-year-selected>p').textContent()).trim();
            const actualYearInt = parseInt(actualYearText, 10);

            const expectedMonthIndex = monthNames.findIndex(m => m === expectedMonth);
            const actualMonthIndex = monthNames.findIndex(m => m === actualMonthText);

            if (expectedMonthIndex === actualMonthIndex && expectedYear == actualYearInt) {
                const dates = await this.page.locator('div.oxd-calendar-date').all();
                for (const dt of dates) {
                    const dtText = await dt.textContent();
                    if (dtText.trim() === expectedDate.toString() && await dt.isVisible()) {
                        await dt.click();
                        break;
                    }
                }
                break; // Thoát khỏi vòng lặp while
            }

            if (actualYearInt > expectedYear ||
                (actualYearInt === expectedYear && actualMonthIndex > expectedMonthIndex)) {
                await this.page.locator('div.oxd-date-wrapper button.oxd-icon-button').first().click();
                console.log('Click previous');
                await this.page.waitForTimeout(3000);
            } else if (actualYearInt < expectedYear || actualYearInt === expectedYear && actualMonthIndex < expectedMonthIndex) {
                await this.page.locator('i.bi-chevron-right').nth(1).click();
                await this.page.waitForTimeout(3000);
                console.log('Click next');

            }
            tries++;
        }
        if (tries >= maxTries) {
            throw new Error('Không tìm được ngày mong muốn sau số lần thử tối đa!');
        }
    }

    async selectDropDown(elementParent, childElements, childValue) {
        await elementParent.click();
        await childElements.first().isVisible();
        const count = await childElements.count();

        for (let i = 0; i < count; i++) {
            const child = await childElements.nth(i);
            const text = await child.textContent();
            if (await text.trim() === childValue) {
                await child.click();
                return;
            }

        } throw new Error(`Value "${childValue}" not found in dropdown`);


    }

    async searchAndSelectASuggestItem(parentElement, childElements, inputValue, expectedValue) {
        await parentElement.fill(inputValue);
        await childElements.first().waitFor({ state: 'visible', timeout: 8000 });
        const count = await childElements.count();

        for (let i = 0; i < count; i++) {
            const element = await childElements.nth(i);
            const elementText = await (await element.innerText()).trim();

            if (elementText.includes(expectedValue)) {
                await element.click();
                return;
            }
        }
        throw new Error(`Value ${expectedValue} is not found in the suggested list!!! `)


    }

    async waitForUrlContains(path, timeout = 5000) {
        if (typeof path === 'string') {
            // Dùng Playwright pattern **path** để match bất cứ gì trước/sau
            await this.page.waitForURL(`**${path}**`, { timeout });
        } else if (path instanceof RegExp) {
            await this.page.waitForURL(path, { timeout });
        } else {
            throw new Error('Path must be a string or RegExp');
        }
    }


    async fillElement(element, key) {
        await element.fill(key);

    }
}
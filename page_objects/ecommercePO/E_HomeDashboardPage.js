import { BasePage } from "../BasePage.js";

export class E_HomeDashboardPage extends BasePage {

    constructor(page) {
        super(page);
        this.myOrderLink = page.locator("button[routerlink*='myorders']");
        this.viewButton = page.locator("button:has-text('View')")
    }

    async navigateToMyOrders() {
        await this.myOrderLink.click();
    }

    async fakeUnathorizedOrderWithUrl(id) {
        await this.page.route(
            "**/api/ecom/order/get-orders-details?id=*",
            async route => {
                const newUrl = `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${id}`;
                await route.continue({ url: newUrl });
            }
        );

        await this.viewButton.first().click();

        // ✅ Sau khi action hoàn tất, gỡ route để tránh ảnh hưởng các test sau
        await this.page.unroute("**/api/ecom/order/get-orders-details?id=*");
    }


    async fakeUnathorizedOrderWithFullfill(id) {
        await this.page.route(
            "**/api/ecom/order/get-orders-details?id=*",
            async route => {
                // Giả lập response 401
                await route.fulfill({
                    status: 401, 
                    contentType: 'application/json',
                    body: JSON.stringify({
                        message: "You are not authorize to view this order"
                    })
                });
            }
        );

        // Trigger request
        await this.viewButton.first().click();

        // ✅ Cleanup để không ảnh hưởng test khác
        await this.page.unroute("**/api/ecom/order/get-orders-details?id=*");
    }


}
import { test as baseTest, request } from '@playwright/test';

export const apiTest = baseTest.extend({

    apiContext: async ({ }, use) => {
        const apiContext = await request.newContext();
        await use(apiContext);
        await apiContext.dispose();
    },
    adminApiLogin: async ({ apiContext }, use) => {
        const reponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: {
                userEmail: "anshika@gmail.com",
                userPassword: "Iamking@000"
            }

        })

        const reponseJson = await reponse.json();
        const token = reponseJson.token;
        const userId = reponseJson.userId;
        use({ token, userId });
    }

});

export { expect } from '@playwright/test';



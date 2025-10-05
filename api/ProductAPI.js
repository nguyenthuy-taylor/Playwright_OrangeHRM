import { BaseAPI } from './BaseAPI.js';

export class UserAPI extends BaseAPI {
    constructor(apiContext) {
        super(apiContext);
    }

    async getProductId(productName) {
        const response = await this.post(`/api/ecom/product/get-all-products`, {
            data: {
                productName: "",
                minPrice: null,
                maxPrice: null,
                productCategory: [],
                productSubCategory: [],
                productFor: []
            },
            headers: {
                Authorization: `${token}`
            }

        });
        await this.handleResponse(response);
        const responseJson = await response.json();
        const productData = await responseJson.data; // Array

        // Lọc ra sản phẩm theo tên
        const foundProduct = productData.find(p => p.productName === productName);

        if (!foundProduct) {
            throw new Error(`❌ Cannot find product with name: ${productName}`);
        }

        return foundProduct._id;


    }


    async getProductToView(productid, token) {
        const response = await this.get(`/api/ecom/product/get-product-detail/${productid}`,
            {
                headers: {
                    Authorization: `${token}`
                }
            })
        await this.handleResponse(response);
        const responseJson = await response.json();
        const productData = await responseJson.data;

        return {
            productName: productData.productName,
            message: productData.message
        };
    }
}

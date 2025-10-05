export class BaseAPI {
    constructor(request) {
        this.request = request;
        this.baseUrl = process.env.BASE_URL || 'https://rahulshettyacademy.com';
    }

    async get(endpoint, headers = {}) {
        return await this.request.get(`${this.baseUrl}${endpoint}`, { headers });
    }

    async post(endpoint, { options }) {
        return await this.request.post(`${this.baseUrl}${endpoint}`, { options });
    }

    async put(endpoint, { options }) {
        return await this.request.put(`${this.baseUrl}${endpoint}`, { options });
    }

    async delete(endpoint, headers = {}) {
        return await this.request.delete(`${this.baseUrl}${endpoint}`, { headers });
    }

    async handleResponse(response) {
        if (!response.ok()) {
            throw new Error(`Failed to fetch product detail:${response.status()}`)
        }
        return await response.json();
    }
}

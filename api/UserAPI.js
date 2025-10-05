import { BaseAPI } from './BaseAPI.js';

export class UserAPI extends BaseAPI {
    constructor(apiContext) {
        super(apiContext);
    }
    async getUser(id) {
        return await this.get(`/users/${id}`);
    }

    async createUser(data) {
        return await this.post(`/users`, data);
    }
}

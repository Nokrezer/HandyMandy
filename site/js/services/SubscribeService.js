import { API } from "../settings/config.js";
export class SubscribeService {
    constructor(requestService) {
        this.sendRequest = requestService.sendRequest;
        this.setSubscription = this.setSubscription.bind(this);
        this.getSubscription = this.getSubscription.bind(this);
    }
    async setSubscription(accessToken, targetUserId) {
        await this.sendRequest(`${API.setSubscribe}?userId=${targetUserId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    }
    async getSubscription(accessToken, targetUserId) {
        const response = await this.sendRequest(`${API.getSubscribe}?userId=${targetUserId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return await response.json();
    }
    async getUserFollowers(accessToken, userId) {
        const response = await this.sendRequest(`${API.getUserFollowers}?userId=${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return await response.json();
    }
}

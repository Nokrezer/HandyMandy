import { CONFIG, AUTH, API } from "../settings/config.js";
export class LikeService {
    constructor(requestService) {
        this.sendRequest = requestService.sendRequest;
        this.setPostLike = this.setPostLike.bind(this);
        this.getPostLikes = this.getPostLikes.bind(this);
    }
    async setPostLike(accessToken, postId) {
        await this.sendRequest(`${API.setLike}?postId=${postId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    }
    async getPostLikes(accessToken, postId) {
        const response = await this.sendRequest(`${API.postLikes}?postId=${postId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return (await response.json())["COUNT(*)"];
    }
    async getProductLikes(accessToken, productId) {
        const response = await this.sendRequest(`${API.getProductLikes}?productId=${productId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return (await response.json())["COUNT(*)"];
    }
    async setProductLike(accessToken, productId) {
        await this.sendRequest(`${API.setProductLike}?productId=${productId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    }
    async getUserLikedProducts(accessToken) {
        const response = await this.sendRequest(`${API.getUserLikedProducts}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return await response.json();
    }
    async getLikedPosts({ accessToken, limit = 50, offset = 0 }) {
        const response = await this.sendRequest(`${API.getLikedPosts}?limit=${limit}&offset=${offset}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return await response.json();
    }
    async getLikedProducts({ accessToken, limit = 50, offset = 0 }) {
        const response = await this.sendRequest(`${API.getLikedProducts}?limit=${limit}&offset=${offset}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return await response.json();
    }
}

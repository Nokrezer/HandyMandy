import { CONFIG, AUTH, API } from "../settings/config.js";
export class PostService {
    constructor(requestService) {
        this.sendRequest = requestService.sendRequest;
        this.createNewPost = this.createNewPost.bind(this);
        this.getUserPosts = this.getUserPosts.bind(this);
        this.getFeed = this.getFeed.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }
    async deletePost(accessToken, postId) {
        await this.sendRequest(`${API.deletePost}?postId=${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    async createNewPost(files, text, accessToken) {
        const data = new FormData(); //Создаём форму, которая будет содержать файлы и описание
        Array.from(files).forEach(file => data.append("files", file)); //Перечисляем все файлы и добавляем в форму
        data.append("text", text); //Добавляем в форму описания поста
        await this.sendRequest(API.createNewPost, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: data
        });
    }
    async getUserPosts({ accessToken, userId, limit = 50, offset = 0 }) {
        const response = await this.sendRequest(`${API.userPosts}?userId=${userId}&limit=${limit}&offset=${offset}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return await response.json();
    }
    async getFeed(accessToken) {
        const response = await this.sendRequest(API.getFeed, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status !== 200)
            return await response.text();
        return await response.json();
    }
    async getPostOwnerId(accessToken, postId) {
        const response = await this.sendRequest(`${API.getPostOwnerId}?postId=${postId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return await response.text();
    }
}

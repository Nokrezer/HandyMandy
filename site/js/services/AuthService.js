import { CONFIG, AUTH, API } from "../settings/config.js";
export class AuthService {
    constructor(requestService) {
        this.accessToken = null; //Храним access токен в памяти
        this.sendRequest = requestService.sendRequest;
        this.verifyToken = this.verifyToken.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getFileToken = this.getFileToken.bind(this);
        this.login = this.login.bind(this);
        this.registration = this.registration.bind(this);
    }
    async login(formData) {
        const data = new FormData();
        data.append("login", formData.login || formData.email);
        data.append("password", formData.password);
        const response = await this.sendRequest(CONFIG.SITE_IP + AUTH.login, {
            method: "POST",
            body: data,
            credentials: 'include'
        });
        this.accessToken = (await response.json())["ACCESS_TOKEN"];
        return this.accessToken;
    }
    async registration(formData) {
        let data = new FormData(); //Создаём форму для отправки
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("nickName", formData.nickName);
        data.append("name", formData.name);
        data.append("consentVersion", formData.consentVersion);
        await this.sendRequest(CONFIG.SITE_IP + AUTH.registration, {
            method: "POST",
            body: data
        });
    }
    async verifyToken(accessToken) {
        if (!accessToken)
            return false;
        try {
            await this.sendRequest(API.verifyToken, { method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async getAccessToken() {
        const tokenValidity = await this.verifyToken(this.accessToken);
        if (tokenValidity)
            return this.accessToken;
        const response = await this.sendRequest(AUTH.updateAccessToken, { method: "POST",
            credentials: 'include' }); //Запрос к серверу
        this.accessToken = (await response.json()).ACCESS_TOKEN; //Получаем access токен со словаря
        return this.accessToken;
    }
    async getFileToken(accessToken) {
        let response = await this.sendRequest(AUTH.fileToken, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return await response.text();
    }
}

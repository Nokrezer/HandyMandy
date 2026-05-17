import {API} from "../settings/config.js";

export class UserService{
    constructor(requestService){
        this.sendRequest = requestService.sendRequest;
        this.privateUserData = null;//Приватные данные пользователя, храним в памяти

        this.getPrivateUserInfo = this.getPrivateUserInfo.bind(this);
        this.getPublicUserInfo = this.getPublicUserInfo.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.newProfilePhoto = this.newProfilePhoto.bind(this);
        this.setUserData = this.setUserData.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    async getPrivateUserInfo(accessToken)//Для получения информации авторизованного пользователя
    {
        // if(this.privateUserData)
        //     return this.privateUserData;

        const response = await this.sendRequest(API.privateUserData, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        this.privateUserData = await response.json();
        return this.privateUserData;
    }

    async getPublicUserInfo({accessToken, id=null, nickName=null})//Получение публичной информации пользователя
    {
        const request = id !== null ? "id=" + id : "nickName=" + nickName;
        
        const response = await this.sendRequest(`${API.publicUserData}?${request}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        return await response.json();
    }
    
    async getUserId(accessToken, nickName)
    {
        const response = await fetch(`${API.userId}?nickName=${nickName}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        return (await response.json())["id"];
    }

    async newProfilePhoto(accessToken, form){
        await this.sendRequest(`${API.setProfilePhoto}`, {
            method: "POST",
            headers: {Authorization: `Bearer ${accessToken}`},
            body: form
        });
    }

    async setUserData(accessToken, form){
        await this.sendRequest(API.setUserData, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`},
            body: form
        });
    }

    async setPassword(accessToken, form){
        await this.sendRequest(API.setPassword, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`},
            body: form
        });
    }

    async setEmail(accessToken, form){
        await this.sendRequest(API.setEmail, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`},
            body: form
        });
    }
}
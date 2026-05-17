import {CONFIG, AUTH, API} from "../settings/config.js";

export class ProductService{
    constructor(requestService){
        this.sendRequest = requestService.sendRequest;

        this.createNewProduct = this.createNewProduct.bind(this);
        this.getUserProducts = this.getUserProducts.bind(this);
        // this.getFeed = this.getFeed.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    async deleteProduct(accessToken, productId){
        await this.sendRequest(`${API.removeProduct}?productId=${productId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`}
        });
    }

    async createNewProduct({files, text, price, statuses, accessToken}){
        const data = new FormData();//Создаём форму, которая будет содержать файлы и описание
        Array.from(files).forEach(file => data.append("files", file));//Перечисляем все файлы и добавляем в форму
        data.append("text", text);//Добавляем в форму описания поста
        data.append("statuses", statuses);
        data.append("price", price);

        await this.sendRequest(API.createNewProduct, {//Делаем запрос к серверу
            method:"POST",
            headers: {Authorization: `Bearer ${accessToken}`},
            body: data
        });
    }

    async getUserProducts({accessToken, userId, limit=50, offset=0})
    {
        const response = await this.sendRequest(`${API.getUserProducts}?userId=${userId}&limit=${limit}&offset=${offset}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        return await response.json();
    }

    async getProductInfo(accessToken, productId){
        const response = await this.sendRequest(`${API.getProductInfo}?productId=${productId}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        return await response.json();
    }

    async getLatestProducts(accessToken){
        const response = await this.sendRequest(API.getLatestProducts, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`}
        });

        return await response.json();
    }

    async searchProducts(accessToken, searchText){
        const response = await this.sendRequest(`${API.searchProducts}?search=${searchText}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`}
        });

        return await response.json();
    }
}
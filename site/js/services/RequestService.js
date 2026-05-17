export class RequestService {
    constructor() {
        this.sendRequest = this.sendRequest.bind(this);
    }
    async sendRequest(path, data) {
        const response = await fetch(path, data);
        if (!response.ok) //Если сервер вернул ошибку(или любой запрос помимо 200)
            throw new Error(await response.text()); //Выкидываем ошибку
        return response;
    }
}

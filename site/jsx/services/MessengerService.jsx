import {CONFIG, AUTH, MESSENGER_API} from "../settings/config.js";
import { ShowMessage } from "../ui/ToastMessages.js";

export class MessengerService{
    constructor(){
        this.connect();
        this.lastMessage = "";
    }

    connect(){
        this.socket = new WebSocket(CONFIG.MESSENGER_IP);
        this.socket.onclose = () => this.connect();
        this.socket.onmessage = (event) => {
            this.setMessage(event.data);
        };
    }

    setMessage(message){
        this.lastMessage = message;
    }

    getMessage(){
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.lastMessage), 20);
        });
    }
    
    //Обработчик в который передаем функцию. Срабатывает на любые действия
    onMessage(func){
        this.socket.onmessage = (event) => func(event);
    }

    //Общий метод, шаблон для отправки запросов
    sendRequest(action, data){
        this.socket.send(JSON.stringify({action:action, ...data}));
    }

    auth(accessToken){
        this.sendRequest(MESSENGER_API.auth, {ACCESS_TOKEN:accessToken});
    }

    getChats(){
        this.sendRequest(MESSENGER_API.getChats);
    }

    sendMessage(message, readerId){
        this.sendRequest(MESSENGER_API.sendMessage, {message:message, readerId:readerId});
    }

    getChatMessages(readerId){
        this.sendRequest(MESSENGER_API.getChatMessages, {readerId: readerId});
    }
}
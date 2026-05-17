import React, {useState, useEffect} from "react";
import {useParams} from "react-router";
import {Link} from 'react-router';

import { messengerService, authService, userService, STYLES, API, CONFIG } from "../../../settings/config.js";
import {Layout, PageStyler} from "../../../settings/pages.js";

async function sendMessageHandler(readerId){
    const messageInput = document.getElementById("input-message");
    
    const accessToken = await authService.getAccessToken();
    messengerService.auth(accessToken);//авторизуемся в мессенджере
    
    messengerService.sendMessage(messageInput.value, readerId);
    
    //Очищаем поле
    messageInput.value = "";
}

export default function Chat(){
    const [loading, setLoading] = useState();
    const [messages, setMessages] = useState([]);
    const [fileToken, setFileToken] = useState();
    const [userInfo, setUserInfo] = useState();

    let {userId} = useParams();
    
    useEffect(() => {
        //При любых ответах сервера смотрим что он прислал
        messengerService.onMessage(async (event) => {
            try{
                const parsedData = JSON.parse(event.data.replace(/'/g, '"'));
                
                
                if("getChatMessages" in parsedData)
                    setMessages(parsedData["getChatMessages"]);

                else if("liveMessage" in parsedData)
                    setMessages(msgs => [...msgs, parsedData["liveMessage"]]);

                else if("sendMessage" in parsedData)
                    setMessages(msgs => [...msgs, parsedData["sendMessage"]]);
            }catch{}
        });

        document.getElementById("input-message").addEventListener("keydown", async (event) => {
            if(event.shiftKey && event.key === "Enter")
                return;
            if(event.key === "Enter")
                await sendMessageHandler(userId);
        });
    }, [userId]);

    useEffect(() => {(async () => {
            const accessToken = await authService.getAccessToken();
            const tmpToken = await authService.getFileToken(accessToken);
            const privateData = await userService.getPrivateUserInfo(accessToken);
            messengerService.auth(accessToken);//авторизуемся в мессенджере
            
            messengerService.getChatMessages(userId);//Получаем все соо из чата
            
            setFileToken(tmpToken);
            setUserInfo(privateData);
            setLoading(false);
            })()}, []);

    useEffect(() => {
        if(!loading && messages.length > 0)
            setScrollEnd();
    }, [loading, messages]);

    const setScrollEnd = () => {
        const viewMessagesBlock = document.getElementById("view-messages");
        viewMessagesBlock.scrollTo(0, viewMessagesBlock.scrollHeight);
    };
        
    if(loading)
        return;
    
    return (<Layout>
                <PageStyler path={STYLES.chats} id={"chats-style"}/>

                <div className="page-block block">
                    <div className="buttons-bar block">
                        <a href={CONFIG.SITE_IP + "/" + "messenger"} className="messenger-link">Чаты</a>
                    </div>
                    
                    <div id="view-messages">
                        {messages.map(message => {
                            return <div key={message.message_id} className={"message " + (userInfo.id == message.user_id ? "my-message" : '')}>
                                <p className="message-text">{message.message}</p>
                            </div>;
                        })}
                    </div>
                    
                    <div className="input-block center">
                        <textarea id="input-message"/>
                        <button className="send-message-button block" onClick={async () => await sendMessageHandler(userId)}>Отправить</button>
                    </div>
                </div>
            </Layout>);
}
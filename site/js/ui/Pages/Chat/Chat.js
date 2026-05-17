import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from 'react-router';
import { messengerService, authService, userService, STYLES, API, CONFIG } from "../../../settings/config.js";
import { Layout, PageStyler } from "../../../settings/pages.js";
async function sendMessageHandler(readerId) {
    const messageInput = document.getElementById("input-message");
    const accessToken = await authService.getAccessToken();
    messengerService.auth(accessToken); //авторизуемся в мессенджере
    messengerService.sendMessage(messageInput.value, readerId);
    //Очищаем поле
    messageInput.value = "";
}
export default function Chat() {
    const [loading, setLoading] = useState();
    const [messages, setMessages] = useState([]);
    const [fileToken, setFileToken] = useState();
    const [userInfo, setUserInfo] = useState();
    let { userId } = useParams();
    useEffect(() => {
        //При любых ответах сервера смотрим что он прислал
        messengerService.onMessage(async (event) => {
            try {
                const parsedData = JSON.parse(event.data.replace(/'/g, '"'));
                if ("getChatMessages" in parsedData)
                    setMessages(parsedData["getChatMessages"]);
                else if ("liveMessage" in parsedData)
                    setMessages(msgs => [...msgs, parsedData["liveMessage"]]);
                else if ("sendMessage" in parsedData)
                    setMessages(msgs => [...msgs, parsedData["sendMessage"]]);
            }
            catch { }
        });
        document.getElementById("input-message").addEventListener("keydown", async (event) => {
            if (event.shiftKey && event.key === "Enter")
                return;
            if (event.key === "Enter")
                await sendMessageHandler(userId);
        });
    }, [userId]);
    useEffect(() => {
        (async () => {
            const accessToken = await authService.getAccessToken();
            const tmpToken = await authService.getFileToken(accessToken);
            const privateData = await userService.getPrivateUserInfo(accessToken);
            messengerService.auth(accessToken); //авторизуемся в мессенджере
            messengerService.getChatMessages(userId); //Получаем все соо из чата
            setFileToken(tmpToken);
            setUserInfo(privateData);
            setLoading(false);
        })();
    }, []);
    useEffect(() => {
        if (!loading && messages.length > 0)
            setScrollEnd();
    }, [loading, messages]);
    const setScrollEnd = () => {
        const viewMessagesBlock = document.getElementById("view-messages");
        viewMessagesBlock.scrollTo(0, viewMessagesBlock.scrollHeight);
    };
    if (loading)
        return;
    return (React.createElement(Layout, null,
        React.createElement(PageStyler, { path: STYLES.chats, id: "chats-style" }),
        React.createElement("div", { className: "page-block block" },
            React.createElement("div", { className: "buttons-bar block" },
                React.createElement("a", { href: CONFIG.SITE_IP + "/" + "messenger", className: "messenger-link" }, "\u0427\u0430\u0442\u044B")),
            React.createElement("div", { id: "view-messages" }, messages.map(message => {
                return React.createElement("div", { key: message.message_id, className: "message " + (userInfo.id == message.user_id ? "my-message" : '') },
                    React.createElement("p", { className: "message-text" }, message.message));
            })),
            React.createElement("div", { className: "input-block center" },
                React.createElement("textarea", { id: "input-message" }),
                React.createElement("button", { className: "send-message-button block", onClick: async () => await sendMessageHandler(userId) }, "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C")))));
}

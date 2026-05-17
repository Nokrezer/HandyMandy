import React, { useState, useEffect } from "react";
import { Link } from 'react-router';
import { PageStyler } from "../../../settings/pages.js";
import { messengerService, authService, userService, STYLES, API } from "/js/settings/config.js";
// import PageStyler from "../../Styler.jsx";
export default function ChatPage() {
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [fileToken, setFileToken] = useState();
    const [userId, setUserId] = useState();
    useEffect(() => {
        (async () => {
            // try{
            const accessToken = await authService.getAccessToken();
            const tmpToken = await authService.getFileToken(accessToken);
            messengerService.auth(accessToken); //авторизуемся в мессенджере
            const { id } = await userService.getPrivateUserInfo(accessToken);
            // alert(id);
            setUserId(id);
            messengerService.getChats(); //Получаем все чаты пользователя
            const response = await messengerService.getMessage();
            const parsedResponse = JSON.parse(response.replace(/'/g, '"'));
            setChats(parsedResponse);
            setFileToken(tmpToken);
            setLoading(false);
            // }catch{}
        })();
    }, []);
    if (loading)
        return;
    return (React.createElement("div", { className: "page-block" },
        React.createElement(PageStyler, { path: STYLES.chats, id: "chats-style" }),
        React.createElement("div", { id: "chats", className: "block" }, chats.getChats.map(chat => {
            try { //id собеседника
                const reader_id = chat.reader_id == userId ? chat.writer_id : chat.reader_id;
                return React.createElement(Link, { to: "chat/" + reader_id, key: reader_id, className: "chat" },
                    React.createElement("img", { className: "user-photo", src: `${API.get}/${chat.photo_url}?token=${fileToken}` }),
                    React.createElement("p", { className: "user-name" }, chat.name));
            }
            catch { }
        }))));
}

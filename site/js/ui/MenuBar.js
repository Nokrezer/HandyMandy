import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { API, PAGES, authService, userService, CONFIG } from "../settings/config.js";
export default function UserMenuBarComponent({ userSettings }) {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setError] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const accessToken = await authService.getAccessToken();
                const userData = await userService.getPrivateUserInfo(accessToken); //Получаем информацию об пользователе
                const fileToken = await authService.getFileToken(accessToken); //Получаем временный токен для доступа к файлам
                const menuItems = [
                    { text: "", url: "", image: "/img/logo.svg" },
                    { text: "Профиль", url: PAGES.user + userData.nick_name, image: API.get + "/" + userData.photo_url + "?token=" + fileToken },
                    { text: "Создать", url: "/create", image: "/img/plus.svg" },
                    { text: "Настройки", url: "/settings", image: "/img/settings.svg" },
                    // {text:"Лента", url:"/creations", image:""},
                    { text: "Каталог", url: "/catalog", image: "/img/catalog.svg" },
                    { text: "Понравившиеся", url: "/liked", image: "/img/like.svg" },
                    { text: "Чаты", url: "/messenger", image: "/img/chat.svg" }
                ];
                setMenuData(menuItems);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [userSettings]);
    if (errorText)
        return null;
    return (React.createElement("div", { id: "menu" }, menuData.map(buttonInfo => React.createElement(Link, { to: buttonInfo.url, className: "menu-button", key: buttonInfo.text },
        buttonInfo.image.includes("svg") ? React.createElement("div", { className: "menu-button-img" },
            React.createElement("object", { data: CONFIG.SITE_IP + buttonInfo.image, type: "image/svg+xml" })) : React.createElement("img", { className: "menu-button-img", src: buttonInfo.image }),
        React.createElement("h2", { className: "menu-button-text" }, buttonInfo.text)))));
}

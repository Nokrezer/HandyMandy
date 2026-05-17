import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router";
import { API, CONFIG, STYLES } from '../../../settings/config.js';
import { PageStyler } from '../../../settings/pages.js';
import { UserPostsBlock } from '../PostsLoader/PostsLoader.js';
import { ProductsBlock } from "../ProductPage/ProductPage.js";
import { copy } from '../../../shared/clipboard.js';
import { useUserPageData } from "./useUserData.js";
import { setUserPhoto } from './setUserPhoto.js';
import { SubscriptionButtons } from "./SubscriptionButtons.js";
export default function UserPage() {
    const userData = useUserPageData();
    const [nowPage, setNowPage] = useState(null); //хранит под страницу. Например карточки товаров или посты пользователя
    const { userInfo, fileToken, privateData, isSubscribed, userFollowers, errorText } = userData; //Деструктуризация полученных данных
    const userPostsBlockMemory = useRef(null); //Для того чтобы заново не подгружать блок с постами пользователя, храним в памяти
    const productsBlockMemory = useRef(null);
    useEffect(() => {
        if (userInfo) {
            document.title = userInfo.name;
            const isUserPage = privateData.nick_name === userInfo.nick_name; //Находится ли пользователь на своей странице или нет
            userPostsBlockMemory.current = userPostsBlockMemory.current ?? React.createElement(UserPostsBlock, { userInfo: userInfo, isUserPage: isUserPage });
            productsBlockMemory.current = productsBlockMemory.current ?? React.createElement(ProductsBlock, { userInfo: userInfo, isUserPage: isUserPage });
            setNowPage(productsBlockMemory.current);
        }
    }, [userInfo]);
    if (!userData.userInfo) //Если вернулось null, значит страница загружается
        return React.createElement("p", null, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430");
    if (errorText)
        return React.createElement("p", null, "\u041E\u0448\u0438\u0431\u043A\u0430");
    const isUserPage = privateData.nick_name === userInfo.nick_name; //Находится ли пользователь на своей странице или нет
    let subscriptionsButtons = React.createElement(SubscriptionButtons, { myNickName: privateData.nick_name, targetNickName: userInfo.nick_name, targetUserId: userInfo.id, isSubscribed: isSubscribed });
    let setUserPhotoFunc = null; //Будет храниться функция, для изменения 
    let linkToCreatePage = null;
    //Если пользователь заходит на свою страницу, то даём доступ к изменению аватара и убираем кнопки подписаться/отписаться и написать сообщение
    if (isUserPage) {
        subscriptionsButtons = null;
        setUserPhotoFunc = setUserPhoto;
        linkToCreatePage = React.createElement(Link, { to: "/create", className: "create-href center block" }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C");
    }
    let statusesBlock = null; //Блок со статусами пользователя
    if (userInfo.statuses != null) {
        const userStatuses = userInfo.statuses.split(",");
        statusesBlock = (React.createElement("div", { className: "statuses-block" }, userStatuses.map(status => React.createElement("p", { className: "status", key: status }, status))));
    }
    return (React.createElement("div", { className: "profile page-block" },
        React.createElement(PageStyler, { path: STYLES.userPage, id: "user-page-style" }),
        React.createElement("div", { id: "user-info", className: "center block" },
            React.createElement("h3", { id: "user-name" }, userInfo.name),
            React.createElement("img", { id: "public-profile-image", src: `${CONFIG.SITE_IP}${API.get}/${userInfo.photo_url}?token=${fileToken}`, onClick: setUserPhotoFunc }),
            React.createElement("p", { id: "nick-name", onClick: () => copy(userInfo.nick_name) },
                "@",
                userInfo.nick_name),
            React.createElement("p", { className: "followers-count" },
                "\u041F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A\u043E\u0432: ",
                Object.keys(userFollowers).length),
            React.createElement("p", { id: "bio" }, userInfo.bio),
            subscriptionsButtons,
            statusesBlock,
            React.createElement("div", { className: "author-posts-choose-buttons" },
                React.createElement("button", { onClick: () => setNowPage(productsBlockMemory.current) }, "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0442\u043E\u0432\u0430\u0440\u043E\u0432"),
                React.createElement("button", { onClick: () => setNowPage(userPostsBlockMemory.current) }, "\u041F\u043E\u0441\u0442\u044B \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F"))),
        linkToCreatePage,
        nowPage));
}

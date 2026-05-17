import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ShowMessage } from "../../ToastMessages.js";
import { authService, userService, subscribeService } from "../../../settings/config.js";
async function setSubscribe(targetNickName) {
    const accessToken = await authService.getAccessToken();
    const userId = await userService.getUserId(accessToken, targetNickName);
    await subscribeService.setSubscription(accessToken, userId);
}
//Компонент, Кнопки подписаться/отписаться, показываем если пользователь не на своей странице
export function SubscriptionButtons({ myNickName, targetNickName, targetUserId, isSubscribed }) {
    const [subscribeState, setSubscribeState] = useState(!isSubscribed); //Хранит значение, подписан ли пользователь на пользователя
    const [result, setResult] = useState(); //Сам результат с jsx кнопками
    const navigate = useNavigate();
    const subscribeHandler = () => {
        try {
            setSubscribe(targetNickName); //Подписываемся или отписываемся от пользователя
            setSubscribeState(!subscribeState); //Делаем ревёрс значения
            ShowMessage(`Вы ${subscribeState ? "подписались на" : "отписались от"} пользователя ${targetNickName}`);
        }
        catch {
            ShowMessage("Не удалось выполнить действие");
        }
    };
    useEffect(() => {
        setResult(React.createElement("div", { id: "button-block-public-user" },
            React.createElement("button", { id: "subscribe-button", className: subscribeState ? "" : "not-visible", onClick: subscribeHandler }, "\u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F"),
            React.createElement("button", { id: "unsubscribe-button", className: subscribeState ? "not-visible" : "", onClick: subscribeHandler }, "\u041E\u0442\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F"),
            React.createElement("button", { id: "send-message-button", onClick: () => navigate("/messenger/chat/" + targetUserId) }, "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435")));
    }, [subscribeState]);
    return result;
}

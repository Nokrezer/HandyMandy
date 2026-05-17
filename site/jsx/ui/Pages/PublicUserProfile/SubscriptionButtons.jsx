import React, {useState, useEffect} from "react";

import {useNavigate} from "react-router";

import { ShowMessage } from "../../ToastMessages.js";

import { authService, userService, subscribeService } from "../../../settings/config.js";

async function setSubscribe(targetNickName){//Если пользователь нажал на кнопку подписаться/отписаться, обращаемся к api
    const accessToken = await authService.getAccessToken();
    const userId = await userService.getUserId(accessToken, targetNickName);
    await subscribeService.setSubscription(accessToken, userId);
}



//Компонент, Кнопки подписаться/отписаться, показываем если пользователь не на своей странице
export function SubscriptionButtons({myNickName, targetNickName, targetUserId, isSubscribed}){
    const [subscribeState, setSubscribeState] = useState(!isSubscribed);//Хранит значение, подписан ли пользователь на пользователя
    const [result, setResult] = useState();//Сам результат с jsx кнопками
    const navigate = useNavigate();

    const subscribeHandler = () => {//Хендлер обработки нажатий на кнопки
        try{
            setSubscribe(targetNickName);//Подписываемся или отписываемся от пользователя
            setSubscribeState(!subscribeState);//Делаем ревёрс значения
            ShowMessage(`Вы ${subscribeState ? "подписались на" : "отписались от"} пользователя ${targetNickName}`);
        }
        catch{
            ShowMessage("Не удалось выполнить действие");
        }
    };

    useEffect(() => {
        setResult(<div id="button-block-public-user">
                        <button id="subscribe-button" className={subscribeState ? "" : "not-visible"} onClick={subscribeHandler}>Подписаться</button>
                        <button id="unsubscribe-button" className={subscribeState ? "not-visible" : ""}  onClick={subscribeHandler}>Отписаться</button>
                        <button id="send-message-button" onClick={() => navigate("/messenger/chat/" + targetUserId)}>Написать сообщение</button>
                    </div>);
    }, [subscribeState]);

    return result;
}
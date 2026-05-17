import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { requestController } from "../config.js";
import { showMessage } from '../other/toastMessages.js';
export async function setSubscribe(targetNickName) {
    const accessToken = await requestController.get_access_token();
    const userId = await requestController.get_user_id(accessToken, targetNickName);
    await requestController.setSubscription(accessToken, userId);
}
export function useUserPageData() {
    const { nickName } = useParams(); //UseParams используем, для получения ника с url строки <string>("")
    const [errorText, setError] = useState(); //Если есть ошибки, то они хранятся тут <string>
    const [userInfo, setInfo] = useState(); //Вся информация об запрашиваемого пользователя <Object>
    const [fileToken, setFileToken] = useState(""); //Токен для получения файлов <string>
    const [privateData, setPrivateData] = useState(Object); //Приватная информация пользователя <Object>
    const [isSubscribed, setIsSubscribed] = useState(false); //Подписан ли пользователь на запрашиваемого пользователя <boolean>
    useEffect(() => {
        (async () => {
            try {
                const accessToken = await requestController.get_access_token(); //Получаем access токен
                const info = await requestController.get_public_user_info(accessToken, nickName = nickName); //Получаем инфо запрашиваемого пользователя
                const tempToken = await requestController.get_file_token(accessToken); //Получаем временный токен(для получения фотографий и файлов)
                const privateData = await requestController.get_private_user_info(accessToken); //Получаем приватную информацию об нашем пользователе
                const userId = await requestController.get_user_id(accessToken, info.nick_name); //Получаем id пользователя из ника запрашеваемого пользователя
                const userSubscribed = await requestController.getSubscription(accessToken, userId); //Получаем данные, подписан ли пользователь на пользователя
                //Присваиваем все данные в useState, для использования в главной функции
                setIsSubscribed(userSubscribed);
                setInfo(info);
                setFileToken(tempToken);
                setPrivateData(privateData);
            }
            catch (error) {
                setError(error.message);
            }
        })();
    }, [nickName]);
    if (!userInfo)
        return null;
    if (errorText) {
        return null;
    }
    return { userInfo, fileToken, privateData, isSubscribed };
}

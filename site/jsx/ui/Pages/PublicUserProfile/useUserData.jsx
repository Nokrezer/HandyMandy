import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import { authService, subscribeService, userService } from '../../../settings/config.js';

import { ShowMessage } from '../../ToastMessages.js';

export function useUserPageData(){//Получение данных пользователя и запрашеваемого пользователя
    const {nickName} = useParams();//UseParams используем, для получения ника с url строки
    
    const [errorText, setError] = useState(null);//Если есть ошибки, то они хранятся тут
    const [userInfo, setInfo] = useState(null);//Вся информация об запрашиваемого пользователя
    const [fileToken, setFileToken] = useState("");//Токен для получения файлов
    const [privateData, setPrivateData] = useState(null);//Приватная информация пользователя
    const [isSubscribed, setIsSubscribed] = useState(null);//Подписан ли пользователь на запрашиваемого пользователя
    const [userFollowers, setUserFollowers] = useState(null);
    useEffect(() => {(async () => {
        try
        {
            const accessToken = await authService.getAccessToken();//Получаем access токен
            const info = await userService.getPublicUserInfo({accessToken, nickName:nickName});//Получаем инфо запрашиваемого пользователя
            const tempToken = await authService.getFileToken(accessToken);//Получаем временный токен(для получения фотографий и файлов)
            const privateData = await userService.getPrivateUserInfo(accessToken);//Получаем приватную информацию об нашем пользователе
            const userId = await userService.getUserId(accessToken, info.nick_name);//Получаем id пользователя из ника запрашеваемого пользователя
            const userSubscribed = await subscribeService.getSubscription(accessToken, userId);//Получаем данные, подписан ли пользователь на пользователя
            const followers = await subscribeService.getUserFollowers(accessToken, userId);
            
            //Присваиваем все данные в useState, для использования в главной функции
            setUserFollowers(followers);
            setIsSubscribed(userSubscribed);
            setInfo(info);
            setFileToken(tempToken);
            setPrivateData(privateData);
        }
        catch(error){
            setError(error.message);
        }
    })();
    }, [nickName]);

    // if(!userInfo)
    //     return null;

    // if(errorText){
    //     return null;
    // }

    return {userInfo, fileToken, privateData, isSubscribed, userFollowers, errorText};
}
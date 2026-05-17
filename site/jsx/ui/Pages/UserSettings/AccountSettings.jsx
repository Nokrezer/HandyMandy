import React, {useEffect, useState} from "react";
import { setEmailHandler, setPasswordHandler } from "./setPrivateData.js";
import { authService, userService } from "../../../settings/config.js";

import { ShowMessage } from "../../ToastMessages.js";

export function UserDataSettings({setSettings, setDialog}){
    const [privateUserData, setUserData] = useState();
    const [loading, setLoading] = useState(true);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        try{
            const accessToken = await authService.getAccessToken();
            await userService.setUserData(accessToken, formData);

            setSettings(Object.fromEntries(formData));
            ShowMessage("Данные были успешно изменены!");
        }
        catch(error){
            ShowMessage(error.message);
        }
    };

    useEffect(() => {
        document.title = "Настройки";
        (async () => {
            const accessToken = await authService.getAccessToken();
            const userData = await userService.getPrivateUserInfo(accessToken);
            
            setUserData(userData);
            setLoading(false);
        })();
    }, []);

    if(loading)
        return <div>Загрузка...</div>;
    
    return (<div className="user-data-settings">
                <div className="public-settings settings-block block">
                    <p>Публичные данные(видны всем пользователям)</p>
                    <form onSubmit={onSubmitHandler} method="POST">
                        <label htmlFor="display-name-input">Отображаемое имя пользователя</label>
                        <input id="display-name-input" name="name" defaultValue={privateUserData.name}/>

                        <label htmlFor="nick-name-input">Никнейм</label>
                        <input id="nick-name-input" name="nick_name" defaultValue={privateUserData.nick_name}/>

                        <label htmlFor="city-input">Город</label>
                        <input id="city-input" name="city" defaultValue={privateUserData.city}/>

                        <label htmlFor="bio-input">Описание профиля</label>
                        <textarea id="bio-input" name="bio" defaultValue={privateUserData.bio}/>

                        <button type="submit" className="submit-button">Сохранить изменения</button>
                    </form>
                </div>

                <div className="private-settings settings-block block">
                    <p>Личные данные</p>
                    <button onClick={() => setEmailHandler(setDialog)}>Изменить адрес электронной почты</button>
                    <button onClick={() => setPasswordHandler(setDialog)}>Изменить пароль</button>
                </div>
            </div>
            );
}
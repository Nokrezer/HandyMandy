import React from "react";
import { authService, userService } from "../../../settings/config.js";

function DialogWindowLayout({children, setDialog}){
    const hideMenu = () => {
        setDialog(null);
    };

    return (<div className="dialog-window" onClick={hideMenu}>
        <div onClick={(event) => {event.stopPropagation()}} className="block">
            {children}
        </div>
    </div>);
}

export function setPasswordHandler(setDialog){//Если пользователь нажимает на кнопку изменить пароль
    const sendSetPasswordHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        try{
            const accessToken = await authService.getAccessToken();
            await userService.setPassword(accessToken, formData);

            ShowMessage("Пароль был успешно изменен!");
        }
        catch(error){
            ShowMessage(error.message);
        }
    };

    setDialog(<DialogWindowLayout setDialog={setDialog}>
            <div className="set-password-window">
                <p>Изменение пароля:</p>
                <form onSubmit={sendSetPasswordHandler} method="POST">
                    <input name="password"/>
                    <button type="submit">Изменить</button>
                </form>
            </div>
        </DialogWindowLayout>);
}

export function setEmailHandler(setDialog){//Если пользователь нажимает на кнопку изменить почту
    const sendSetEmailHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        try{
            const accessToken = await authService.getAccessToken();
            await userService.setEmail(accessToken, formData);

            ShowMessage("Почта была успешно изменена!");
        }
        catch(error){
            ShowMessage(error.message);
        }
    };

    setDialog(<DialogWindowLayout setDialog={setDialog}>
            <div className="set-password-window">
                <p>Изменение почты:</p>
                <form onSubmit={sendSetEmailHandler} method="POST">
                    <input name="email"/>
                    <button type="submit">Изменить</button>
                </form>
            </div>
        </DialogWindowLayout>);
}
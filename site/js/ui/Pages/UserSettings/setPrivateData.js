import React from "react";
import { authService, userService } from "../../../settings/config.js";
function DialogWindowLayout({ children, setDialog }) {
    const hideMenu = () => {
        setDialog(null);
    };
    return (React.createElement("div", { className: "dialog-window", onClick: hideMenu },
        React.createElement("div", { onClick: (event) => { event.stopPropagation(); }, className: "block" }, children)));
}
export function setPasswordHandler(setDialog) {
    const sendSetPasswordHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const accessToken = await authService.getAccessToken();
            await userService.setPassword(accessToken, formData);
            ShowMessage("Пароль был успешно изменен!");
        }
        catch (error) {
            ShowMessage(error.message);
        }
    };
    setDialog(React.createElement(DialogWindowLayout, { setDialog: setDialog },
        React.createElement("div", { className: "set-password-window" },
            React.createElement("p", null, "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F:"),
            React.createElement("form", { onSubmit: sendSetPasswordHandler, method: "POST" },
                React.createElement("input", { name: "password" }),
                React.createElement("button", { type: "submit" }, "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C")))));
}
export function setEmailHandler(setDialog) {
    const sendSetEmailHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const accessToken = await authService.getAccessToken();
            await userService.setEmail(accessToken, formData);
            ShowMessage("Почта была успешно изменена!");
        }
        catch (error) {
            ShowMessage(error.message);
        }
    };
    setDialog(React.createElement(DialogWindowLayout, { setDialog: setDialog },
        React.createElement("div", { className: "set-password-window" },
            React.createElement("p", null, "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043F\u043E\u0447\u0442\u044B:"),
            React.createElement("form", { onSubmit: sendSetEmailHandler, method: "POST" },
                React.createElement("input", { name: "email" }),
                React.createElement("button", { type: "submit" }, "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C")))));
}

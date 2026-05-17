import React, { useEffect, useState } from "react";
import { setEmailHandler, setPasswordHandler } from "./setPrivateData.js";
import { authService, userService } from "../../../settings/config.js";
import { ShowMessage } from "../../ToastMessages.js";
export function UserDataSettings({ setSettings, setDialog }) {
    const [privateUserData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const accessToken = await authService.getAccessToken();
            await userService.setUserData(accessToken, formData);
            setSettings(Object.fromEntries(formData));
            ShowMessage("Данные были успешно изменены!");
        }
        catch (error) {
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
    if (loading)
        return React.createElement("div", null, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...");
    return (React.createElement("div", { className: "user-data-settings" },
        React.createElement("div", { className: "public-settings settings-block block" },
            React.createElement("p", null, "\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435(\u0432\u0438\u0434\u043D\u044B \u0432\u0441\u0435\u043C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C)"),
            React.createElement("form", { onSubmit: onSubmitHandler, method: "POST" },
                React.createElement("label", { htmlFor: "display-name-input" }, "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u043C\u043E\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F"),
                React.createElement("input", { id: "display-name-input", name: "name", defaultValue: privateUserData.name }),
                React.createElement("label", { htmlFor: "nick-name-input" }, "\u041D\u0438\u043A\u043D\u0435\u0439\u043C"),
                React.createElement("input", { id: "nick-name-input", name: "nick_name", defaultValue: privateUserData.nick_name }),
                React.createElement("label", { htmlFor: "city-input" }, "\u0413\u043E\u0440\u043E\u0434"),
                React.createElement("input", { id: "city-input", name: "city", defaultValue: privateUserData.city }),
                React.createElement("label", { htmlFor: "bio-input" }, "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F"),
                React.createElement("textarea", { id: "bio-input", name: "bio", defaultValue: privateUserData.bio }),
                React.createElement("button", { type: "submit", className: "submit-button" }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F"))),
        React.createElement("div", { className: "private-settings settings-block block" },
            React.createElement("p", null, "\u041B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435"),
            React.createElement("button", { onClick: () => setEmailHandler(setDialog) }, "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0430\u0434\u0440\u0435\u0441 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u044B"),
            React.createElement("button", { onClick: () => setPasswordHandler(setDialog) }, "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C"))));
}

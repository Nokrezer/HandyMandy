import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShowMessage } from '../../ToastMessages.js';
import { useForm } from "./useForm.js";
import { authService } from "../../../settings/config.js";
import { PageStyler } from '../../../settings/pages.js';
import { CheckData } from "./checkData.js";
export default function LoginPageComponent() {
    const navigate = useNavigate(); //Нужно для переадресации пользователя
    const [handleChange, values] = useForm({ login: '', password: '' });
    useEffect(() => {
        document.title = "Вход";
    }, []);
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            CheckData(values); //Проверка, все ли поля заполнены. Ничего не возвращает, но вызывает ошибки если какое-либо поле не заполнено
            await authService.login(values);
            window.location.replace('/feed');
            setTimeout(() => {
                navigate("/feed", { replace: true });
            }, 100); //Если нету ошибок, то перенаправляем пользователя на главную страницу
        }
        catch (error) {
            ShowMessage(error.message);
        }
    }
    return (React.createElement("div", { className: "form block center" },
        React.createElement(PageStyler, { path: "../styles/forms.css" }),
        React.createElement("div", null,
            React.createElement("h2", { className: "login-text" }, "\u0412\u0445\u043E\u0434"),
            React.createElement(Link, { to: "/registration", className: "button-url" }, "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F")),
        React.createElement("div", { id: "form-body" },
            React.createElement("input", { type: "text", name: "login", id: "input-login", placeholder: "\u041F\u043E\u0447\u0442\u0430 \u0438\u043B\u0438 \u0432\u0430\u0448 \u043D\u0438\u043A\u043D\u0435\u0439\u043C", value: values.login, onChange: handleChange }),
            React.createElement("input", { type: "password", name: "password", id: "input-password", placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C", value: values.password, onChange: handleChange }),
            React.createElement("button", { id: "login-button", onClick: handleSubmit }, "\u0412\u043E\u0439\u0442\u0438"))));
}

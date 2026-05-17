import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShowMessage } from '../../ToastMessages.js';
import { useForm } from "./useForm.js";
import { authService } from "/js/settings/config.js";
import { PageStyler } from '/js/settings/pages.js';
import { CheckData } from "./checkData.js";
export default function RegistrationPage() {
    const navigate = useNavigate();
    const [handleChange, values] = useForm({ password: '', email: '', name: '', nickName: '', consentVersion: 1 });
    useEffect(() => {
        document.title = "Регистрация";
    }, []);
    async function handleSubmit(event) {
        event.preventDefault();
        // try{
        CheckData(values); //Проверка, все ли поля заполнены. Ничего не возвращает, но вызывает ошибки если какое-либо поле не заполнено
        await authService.registration(values);
        await authService.login(values);
        navigate("/main", { replace: true }); //Если нету ошибок, то перенаправляем пользователя на главную страницу
        // }catch(error){
        //     ShowMessage(error.message);
        // }
    }
    return (React.createElement("div", { className: "form block center" },
        React.createElement(PageStyler, { path: "../styles/forms.css" }),
        React.createElement("div", null,
            React.createElement("h2", { className: "login-text" }, "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F"),
            React.createElement(Link, { to: "/login", className: "button-url" }, "\u0412\u0445\u043E\u0434")),
        React.createElement("div", { id: "form-body" },
            React.createElement("input", { type: "text", name: "email", id: "input-email", placeholder: "\u041F\u043E\u0447\u0442\u0430", value: values.email, onChange: handleChange }),
            React.createElement("input", { type: "text", name: "name", id: "input-name", placeholder: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u043C\u043E\u0435 \u0438\u043C\u044F", value: values.name, onChange: handleChange }),
            React.createElement("input", { type: "text", name: "nickName", id: "input-nickName", placeholder: "\u041D\u0438\u043A\u043D\u0435\u0439\u043C", value: values.nickName, onChange: handleChange }),
            React.createElement("input", { type: "password", name: "password", id: "input-password", placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C", value: values.password, onChange: handleChange }),
            React.createElement("button", { id: "reg-button", onClick: handleSubmit }, "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F"))));
}

import React, {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router';
import { ShowMessage } from '../../ToastMessages.js';
import {useForm} from "./useForm.js";
import {authService} from "/js/settings/config.js";

import { PageStyler } from '/js/settings/pages.js';
import {CheckData} from "./checkData.js";

export default function RegistrationPage()
{
    const navigate = useNavigate();
    const [handleChange, values] = useForm({password:'', email: '', name: '', nickName: '', consentVersion:1});

    useEffect(() => {
            document.title = "Регистрация";
        }, []);
    
    async function handleSubmit(event) {
        event.preventDefault();
        // try{
            CheckData(values);//Проверка, все ли поля заполнены. Ничего не возвращает, но вызывает ошибки если какое-либо поле не заполнено
            await authService.registration(values);
            await authService.login(values);
            navigate("/main", {replace: true});//Если нету ошибок, то перенаправляем пользователя на главную страницу
        // }catch(error){
        //     ShowMessage(error.message);
        // }
    }

    return (
            <div className="form block center">
                <PageStyler path="../styles/forms.css"/>
                <div>
                    <h2 className="login-text">Регистрация</h2>
                    <Link to="/login" className="button-url">Вход</Link>
                </div>
                <div id="form-body">
                    <input type="text" name="email" id="input-email" placeholder="Почта"  value={values.email} onChange={handleChange}/>
                    <input type="text" name="name" id="input-name" placeholder="Отображаемое имя"  value={values.name} onChange={handleChange}/>
                    <input type="text" name="nickName" id="input-nickName" placeholder="Никнейм"  value={values.nickName} onChange={handleChange}/>
                    <input type="password" name="password" id="input-password" placeholder="Пароль"  value={values.password} onChange={handleChange}/>
                    
                    <button id="reg-button" onClick={handleSubmit}>Зарегистрироваться</button>
                </div>
            </div>
        );
}
import React, {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router';
import { ShowMessage } from '../../ToastMessages.js';
import {useForm} from "./useForm.js";
import {authService} from "../../../settings/config.js";

import { PageStyler } from '../../../settings/pages.js';
import {CheckData} from "./checkData.js";


export default function LoginPageComponent()
{
    const navigate = useNavigate();//Нужно для переадресации пользователя
    const [handleChange, values] = useForm({login:'', password:''});

    useEffect(() => {
        document.title = "Вход";
    }, []);

    async function handleSubmit(event)
    {
        event.preventDefault();
        try{
            CheckData(values);//Проверка, все ли поля заполнены. Ничего не возвращает, но вызывает ошибки если какое-либо поле не заполнено
            await authService.login(values);
            window.location.replace('/feed');
            setTimeout(() => {
                navigate("/feed", { replace: true });
            }, 100);//Если нету ошибок, то перенаправляем пользователя на главную страницу
        }
        catch(error){
            ShowMessage(error.message);
        }
    }
    
    return (
                <div className="form block center">
                    <PageStyler path="../styles/forms.css"/>
                    <div>
                        <h2 className="login-text">Вход</h2>
                        <Link to="/registration" className="button-url">Зарегистрироваться</Link>
                    </div>
                    <div id="form-body">
                        <input type="text" name="login" id="input-login" placeholder="Почта или ваш никнейм" value={values.login} onChange={handleChange}/>
                        <input type="password" name="password" id="input-password" placeholder="Пароль" value={values.password} onChange={handleChange}/>
                        
                        <button id="login-button" onClick={handleSubmit}>Войти</button>
                    </div>
                </div>
        );
}
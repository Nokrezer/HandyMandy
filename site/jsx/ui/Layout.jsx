import React from 'react';
import {useLocation} from "react-router";

import { STYLES } from '../settings/config.js';
import { PageStyler } from '../settings/pages.js';
import { UserMenuBar } from '../settings/pages.js';
// import { PageStyler } from './Styler.js';
// import { UserMenuBar } from './MenuBar.js';

import { Toaster } from 'react-hot-toast';

export default function Layout({children, userSettings=null})//общий метод, используемый на многих страницах
{
    const location = useLocation();
    let userMenuBar = null;
    
    if(location.pathname !== "/login" && location.pathname !== "/registration")//Если мы находимся на страница входа/регистрации, не показываем меню пользователю
        userMenuBar = <><PageStyler path={STYLES.menuBar} id={"menu-bar-style"}/>
                    <UserMenuBar userSettings={userSettings}/></>;

    return (
        <div>
            <Toaster/>

            {userMenuBar}
            {children}
        </div>
    );
}
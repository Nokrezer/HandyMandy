import React from 'react';
import { useLocation } from "react-router";
import { STYLES } from '../settings/config.js';
import { PageStyler } from '../settings/pages.js';
import { UserMenuBar } from '../settings/pages.js';
// import { PageStyler } from './Styler.js';
// import { UserMenuBar } from './MenuBar.js';
import { Toaster } from 'react-hot-toast';
export default function Layout({ children, userSettings = null }) {
    const location = useLocation();
    let userMenuBar = null;
    if (location.pathname !== "/login" && location.pathname !== "/registration") //Если мы находимся на страница входа/регистрации, не показываем меню пользователю
        userMenuBar = React.createElement(React.Fragment, null,
            React.createElement(PageStyler, { path: STYLES.menuBar, id: "menu-bar-style" }),
            React.createElement(UserMenuBar, { userSettings: userSettings }));
    return (React.createElement("div", null,
        React.createElement(Toaster, null),
        userMenuBar,
        children));
}

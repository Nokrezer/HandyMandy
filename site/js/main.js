import React, { useEffect, useState, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { Layout, PageStyler } from "/js/settings/pages.js";
import { ROUTES, authService } from "/js/settings/config.js";
const allRoutes = (React.createElement(Routes, null, ROUTES.map(route => {
    return React.createElement(Route, { key: route.path, path: route.path, element: route.element });
})));
//Если пользователь переходит по этим url, то разрещаем доступ
const PUBLIC_PATHS = ["/login", "/registration"];
function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function ClientRoutes() {
    const [userLogged, setLogged] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        let isMounted = true;
        document.body.className = getCookie("theme") ?? "theme-light";
        (async () => {
            try {
                await authService.getAccessToken(); //Получаем новый access токен
                if (isMounted)
                    setLogged(true);
            }
            catch {
                if (isMounted)
                    setLogged(false);
            }
            setLoading(false);
        })();
        return () => {
            isMounted = false;
        };
    }, []);
    if (userLogged == null || loading)
        return "Загрузка";
    if (PUBLIC_PATHS.includes(location.pathname))
        return allRoutes;
    if (!userLogged)
        return React.createElement(Navigate, { to: "/login", replace: true });
    return allRoutes;
}
function main() {
    // const [page, setPage] = useState();
    const root = createRoot(document.getElementById("application"));
    // try{
    //     setPage(<ClientRoutes/>);
    // }
    // catch{
    //     // setPage(<Layout/>);
    // }
    root.render(React.createElement(BrowserRouter, null,
        React.createElement(Suspense, { fallback: React.createElement("div", null, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B...") },
            React.createElement(Layout, null,
                React.createElement(ClientRoutes, null)))));
}
main();

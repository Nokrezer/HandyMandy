import React from "react";
function setTheme(themeName) {
    document.body.className = themeName;
    document.cookie = `theme=${themeName}`;
}
export function ThemesSettings() {
    return (React.createElement("div", { className: "themes-settings settings-block block" },
        React.createElement("button", { className: "light-theme-buttom theme-button", onClick: () => setTheme("theme-light") },
            React.createElement("div", { className: "theme-circle" }),
            React.createElement("p", null, "\u0421\u0432\u0435\u0442\u043B\u0430\u044F")),
        React.createElement("button", { className: "dark-theme-buttom theme-button", onClick: () => setTheme("theme-black") },
            React.createElement("div", { className: "theme-circle" }),
            React.createElement("p", null, "\u0422\u0435\u043C\u043D\u0430\u044F"))));
}

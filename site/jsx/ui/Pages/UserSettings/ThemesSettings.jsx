import React from "react";

function setTheme(themeName){
    document.body.className = themeName;
    document.cookie = `theme=${themeName}`;
}

export function ThemesSettings(){
    return (<div className="themes-settings settings-block block">
            <button className="light-theme-buttom theme-button" onClick={() => setTheme("theme-light")}><div className="theme-circle"/><p>Светлая</p></button>
            <button className="dark-theme-buttom theme-button" onClick={() => setTheme("theme-black")}><div className="theme-circle"/><p>Темная</p></button>
            {/* <button className="pink-theme-buttom theme-button"><div className="theme-circle"/><p>Розовая</p></button> */}
        </div>);
}
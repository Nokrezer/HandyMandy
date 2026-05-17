import React, { useEffect, useState } from "react";
import { PageStyler } from '/js/settings/pages.js';
import { ThemesSettings } from "./ThemesSettings.js";
import { UserDataSettings } from "./AccountSettings.js";
export default function SettingsPage() {
    const [userSettings, setSettings] = useState();
    const [dialogWindow, setDialog] = useState();
    const [nowPage, setPage] = useState(React.createElement(UserDataSettings, { setSettings: setSettings, setDialog: setDialog })); // onSettingsChange={setSettings}
    return (React.createElement("div", { className: "settings" },
        React.createElement(PageStyler, { path: "../../styles/settings.css" }),
        React.createElement("div", { className: "select-menu-settings block" },
            React.createElement("button", { onClick: () => setPage(React.createElement(UserDataSettings, { setSettings: setSettings, setDialog: setDialog })) }, "\u0414\u0430\u043D\u043D\u044B\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"),
            React.createElement("button", { onClick: () => setPage(React.createElement(ThemesSettings, null)) }, "\u0422\u0435\u043C\u044B")),
        React.createElement("div", { className: "settings-page" }, nowPage),
        dialogWindow));
}

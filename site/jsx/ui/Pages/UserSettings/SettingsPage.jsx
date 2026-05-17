import React, {useEffect, useState} from "react";

import { PageStyler } from '/js/settings/pages.js';

import { ThemesSettings } from "./ThemesSettings.js";
import { UserDataSettings } from "./AccountSettings.js";


export default function SettingsPage(){
    const [userSettings, setSettings] = useState();
    const [dialogWindow, setDialog] = useState();
    const [nowPage, setPage] = useState(<UserDataSettings setSettings={setSettings}  setDialog={setDialog}/>);// onSettingsChange={setSettings}

    return (
                <div className="settings">
                    <PageStyler path="../../styles/settings.css"/>
                    <div className="select-menu-settings block">
                        <button onClick={() => setPage(<UserDataSettings setSettings={setSettings} setDialog={setDialog}/>)}>Данные аккаунта</button>
                        <button onClick={() => setPage(<ThemesSettings/>)}>Темы</button>
                    </div>

                    <div className="settings-page">
                        {nowPage}
                    </div>
                    {dialogWindow}
                </div>

                
            );
}
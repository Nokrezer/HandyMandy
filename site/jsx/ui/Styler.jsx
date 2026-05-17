import React from "react";

export default function PageStyler({path})//Общий метод, для указания загрузки стилей
{
    return (<link rel="stylesheet" href={path}></link>);
}
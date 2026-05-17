import React from "react";
import { requestController } from "../config.js";
import { showMessage } from "./toastMessages.js";
export async function setUserPhoto() {
    try {
        const photo = await window.showOpenFilePicker({ multiple: false }); //Окно для выбора нового изображения
        const accessToken = await requestController.get_access_token(); //Получаем access токен
        const formData = new FormData(); //Создаём форму
        formData.append("photo", await photo[0].getFile()); //в форму добавляем новую аватарку
        await requestController.newProfilePhoto(accessToken, formData); //Отправляем на сервер новую аватарку пользователя
        window.location.reload(); //Перезагружаем страницу если всё удачно
    }
    catch (error) {
        if (error.name !== "AbortError") //Если ошибка произошла не по причине, того что пользователь отменил выбор файлов
            showMessage("Не удалось обновить фото");
    }
}

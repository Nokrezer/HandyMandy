import { postService, authService } from "../../../settings/config.js";
import { ShowMessage } from "../../ToastMessages.js";
export async function sendFiles(files, setFiles) {
    const textInput = document.getElementById("text-input");
    try {
        const accessToken = await authService.getAccessToken();
        await postService.createNewPost(files, textInput.value, accessToken); //Отправляем запрос серверу, на создание поста
        setFiles([]); //Обнуляем файлы
        textInput.value = ""; //Обнуляем ввод описания
        ShowMessage("Пост был успешно создан!");
    }
    catch {
        ShowMessage("Ошибка при создании поста");
    }
}

import { productService, authService } from "../../../settings/config.js";

import { ShowMessage } from "../../ToastMessages.js";

export async function sendProduct(files, setFiles){
    const textInput = document.getElementById("text-input");
    const priceInput = document.getElementById("product-price-input");
    const statusesInput = document.getElementById("about-product-input");
    
    try
    {
        const accessToken = await authService.getAccessToken();
        await productService.createNewProduct({files:files, text:textInput.value, 
                                        accessToken:accessToken, statuses:statusesInput.value, price:priceInput.value});//Отправляем запрос серверу, на создание поста

        setFiles([]);//Обнуляем файлы
        textInput.value = "";//Обнуляем ввод описания
        priceInput.value = "";
        statusesInput.value = "";

        ShowMessage("Карточка была успешно создана!");
    }
    catch{
        ShowMessage("Ошибка при создании карточки товара");
    }
}
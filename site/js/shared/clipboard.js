import { ShowMessage } from '../ui/ToastMessages.js';
export async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
        ShowMessage("Скопировано в буфер обмена");
    }
    catch (error) {
        ShowMessage("Ошибка при копировании");
    }
}

//При клике на область для сброса файлов, открываем диалоговое окно, чтобы пользователь выбрал файлы
export async function fileChooser(files, setFiles) {
    try {
        const filesList = await window.showOpenFilePicker({ multiple: true }); //Окно для выбора
        const newFilesList = []; //Создаём новый временный список, для хранения файлов
        for (let fileHandler of filesList) //Перечисляем файлы
            newFilesList.push(await fileHandler.getFile()); //Заносим в список полученные файлы
        setFiles(newFilesList); //Записываем готовые файлы в основной список
    }
    catch { }
}

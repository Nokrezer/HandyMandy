import React, { useEffect, useState } from "react";
function removeImage(index, files, setFiles) {
    setFiles([...files.slice(0, index), ...files.slice(index + 1, files.length)]);
}
export function Post({ files, setFiles }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [result, setResult] = useState();
    let filesUrls = []; //Массив с ссылками на файлы пользователя
    Array.from(files).forEach(fileObj => filesUrls.push(URL.createObjectURL(fileObj))); //Перебираем каждый файловый объект, создаем ссылку и заносим в массив
    const deleteBtnHandler = () => {
        removeImage(currentImage, files, setFiles); //Удаляем изображение, на котором сейчас находится пользователь
        if (currentImage >= files.length - 1)
            setCurrentImage(currentImage - 1);
    };
    useEffect(() => {
        setResult(React.createElement("div", { className: "post" },
            React.createElement("div", { className: "content" },
                React.createElement("div", { className: "images-list" },
                    React.createElement("button", { className: "switch-image-button previous-image-button", onClick: () => setCurrentImage(currentImage > 0 ? currentImage - 1 : files.length - 1) },
                        React.createElement("p", null, "<")),
                    filesUrls.map((fileUrl, index) => {
                        // Первое изображение имеет css класс selected-image, чтобы оно было единственным видимым
                        return (React.createElement("div", { className: "image-block" + (index == currentImage ? " selected-image" : ""), key: fileUrl },
                            React.createElement("img", { src: fileUrl })));
                    }),
                    React.createElement("button", { id: "delete-image-button", onClick: deleteBtnHandler }, "x"),
                    React.createElement("button", { className: "switch-image-button next-image-button", onClick: () => setCurrentImage(currentImage < files.length - 1 ? currentImage + 1 : 0) },
                        React.createElement("p", null, ">"))))));
    }, [currentImage, files]);
    return result;
}

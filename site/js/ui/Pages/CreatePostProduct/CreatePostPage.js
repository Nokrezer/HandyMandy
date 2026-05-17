import React, { useState, useEffect } from 'react';
import { STYLES } from '../../../settings/config.js';
import { PageStyler } from '../../../settings/pages.js';
import { fileChooser } from "./fileChooser.js";
import { Post } from "./Post.js";
import { sendFiles } from './sendPost.js';
import { sendProduct } from './sendProduct.js';
//Хендлеры для обработки загрузки фотографий при скидывании на элемент или на его нажатии
function dropHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    files = event.dataTransfer.files;
}
//Хендлер - заглушка
function dragEvents(event) {
    event.preventDefault();
    event.stopPropagation();
}
//Компоненты
function DropFiles({ files, setFiles }) {
    const [result, setResult] = useState();
    useEffect(() => {
        if (files.length > 0) { //Если загружены изображения, то показываем их
            setResult(React.createElement(Post, { files: files, setFiles: setFiles }));
        }
        else { //Если не загружены, то показываем загрузку изображений
            setResult(React.createElement("div", { id: "drag-files-block", onClick: async () => await fileChooser(files, setFiles), onDrop: dropHandler, onDragEnter: dragEvents, onDragOver: dragEvents },
                React.createElement("p", { className: "upload-text" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438")));
        }
    }, [files]);
    return result;
}
export default function CreatePostPage() {
    const [files, setFiles] = useState([]);
    const [productInfoWidget, setProductWidget] = useState();
    useEffect(() => {
        document.title = "Создать";
    }, []);
    const onProductRadioHandler = () => {
        setProductWidget(React.createElement("div", { className: "product-settings-upload block center" },
            React.createElement("p", null, "\u0426\u0435\u043D\u0430:"),
            React.createElement("input", { id: "product-price-input" }),
            React.createElement("p", null, "\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438 \u0442\u043E\u0432\u0430\u0440\u0430(\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E):"),
            React.createElement("input", { id: "about-product-input" })));
    };
    const onPostRadioHandler = () => {
        setProductWidget(null);
    };
    const sendEventHandler = async () => {
        if (document.getElementById("post-choose").checked)
            await sendFiles(files, setFiles);
        else if (document.getElementById("product-choose").checked)
            await sendProduct(files, setFiles);
    };
    return (React.createElement("div", { className: "page-block" },
        React.createElement(PageStyler, { path: STYLES.posts, id: "user-posts-style" }),
        React.createElement(PageStyler, { path: STYLES.uploadPost, id: "create-post-page-style" }),
        React.createElement("div", { className: "upload-block center" },
            React.createElement(DropFiles, { files: files, setFiles: setFiles }),
            React.createElement("div", { className: "choose-create block" },
                React.createElement("input", { type: "radio", id: "post-choose", name: "select-create", onChange: onPostRadioHandler, defaultChecked: true }),
                React.createElement("label", { htmlFor: "post-choose" }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u043E\u0441\u0442"),
                React.createElement("input", { type: "radio", id: "product-choose", name: "select-create", onChange: onProductRadioHandler }),
                React.createElement("label", { htmlFor: "product-choose" }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0442\u043E\u0432\u0430\u0440\u0430")),
            productInfoWidget,
            React.createElement("div", { className: "other-info-post" },
                React.createElement("textarea", { id: "text-input" }),
                React.createElement("button", { id: "upload-post", onClick: sendEventHandler }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C")))));
}

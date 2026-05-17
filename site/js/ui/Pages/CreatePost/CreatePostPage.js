import React, { useState, useEffect } from 'react';
import { STYLES } from '../../../settings/config.js';
// import { PageStyler } from '../../Styler.js';
// import { Layout } from '../../Layout.js';
import { PageStyler } from '../../../settings/pages.js';
import { Layout } from '../../../settings/pages.js';
import { fileChooser } from "./fileChooser.js";
import { Post } from "./Post.js";
import { sendFiles } from './sendPost.js';
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
    return (React.createElement(Layout, null,
        React.createElement(PageStyler, { path: STYLES.posts, id: "user-posts-style" }),
        React.createElement("div", { className: "create-post-block" },
            React.createElement(PageStyler, { path: STYLES.uploadPost, id: "create-post-page-style" }),
            React.createElement(DropFiles, { files: files, setFiles: setFiles }),
            React.createElement("div", { className: "other-info-post" },
                React.createElement("textarea", { id: "text-input" }),
                React.createElement("button", { id: "upload-post", onClick: async () => await sendFiles(files, setFiles) }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043F\u043E\u0441\u0442")))));
}

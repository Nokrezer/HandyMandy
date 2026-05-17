import React, { useState, useEffect } from "react";
import { postService, authService, CONFIG, API } from "../../../settings/config.js";
import { ShowMessage } from '../../ToastMessages.js';
import { LikeButton } from "./LikeButton.js";
import { PostDate } from "./postDate.js";
function PostSettings({ postInfo, setPosts }) {
    const deletePostHandler = async () => {
        try {
            const accessToken = await authService.getAccessToken();
            await postService.deletePost(accessToken, postInfo.post_id);
            setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postInfo.post_id));
            ShowMessage("Пост удалён");
        }
        catch (error) {
            ShowMessage(error.message);
        }
    };
    return (React.createElement("div", { className: "settings-menu visible-settings block" },
        React.createElement("button", { onClick: deletePostHandler }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u043E\u0441\u0442")));
}
export function Post({ userInfo, post, fileToken, isUserPage, setPosts }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [postSettings, setPostSettings] = useState(null);
    let images = Object.entries(JSON.parse(post.files_types.replace(/'/g, '"')));
    const viewPostSettingsHandler = (event) => {
        event.stopPropagation();
        setPostSettings(React.createElement(PostSettings, { postInfo: post, setPosts: setPosts }));
    };
    useEffect(() => {
        const handleClickOutside = () => setPostSettings(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    return (React.createElement("div", { className: "post block" },
        React.createElement("div", { className: "author-info" },
            React.createElement("a", { href: "/user/" + userInfo.nick_name },
                React.createElement("img", { className: "post-author-photo", src: `${CONFIG.SITE_IP}${API.get}/${userInfo.photo_url}?token=${fileToken}` })),
            React.createElement("a", { className: "post-author-name", href: "/user/" + userInfo.nick_name },
                React.createElement("p", null, userInfo.name))),
        React.createElement("div", { className: "content" },
            React.createElement("div", { className: "images-list" }, //Если загружено только одно фото, то не отрисовываем кнопку
                images.length > 1 ? React.createElement("button", { className: "switch-image-button previous-image-button", onClick: () => setCurrentImage(currentImage > 0 ? currentImage - 1 : images.length - 1) },
                    React.createElement("p", null, "<")) : null,
                images.map(([fileName, fileType], index) => {
                    //Первое изображение имеет css класс selected-image, чтобы оно было единственным видимым
                    return (React.createElement("div", { className: "image-block" + (index == currentImage ? " selected-image" : ""), key: fileName },
                        React.createElement("img", { className: "post-image", src: `${API.get}/posts/${fileType}/${fileName}?token=${fileToken}` })));
                }),
                images.length > 1 ? React.createElement("button", { className: "switch-image-button next-image-button", onClick: () => setCurrentImage(currentImage < images.length - 1 ? currentImage + 1 : 0) },
                    React.createElement("p", null, ">")) : null),
            React.createElement("p", { className: "post-text" }, post.text)),
        React.createElement("div", { className: "actions-bar" },
            React.createElement(LikeButton, { postId: post.post_id, post: post }),
            isUserPage ?
                React.createElement("div", { className: "settings-block" },
                    React.createElement("button", { className: "settings-button", onClick: viewPostSettingsHandler },
                        React.createElement("p", null, "...")),
                    postSettings)
                : null),
        React.createElement("p", { className: "post-date" },
            React.createElement(PostDate, { post: post }))));
}

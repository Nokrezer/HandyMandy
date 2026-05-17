import React, {useState, useEffect} from "react";

import { postService, authService, CONFIG, API } from "../../../settings/config.js";

import { ShowMessage } from '../../ToastMessages.js';
import {LikeButton} from "./LikeButton.js";
import {PostDate} from "./postDate.js";

function PostSettings({postInfo, setPosts}){//Настройки поста(при нажатии на троеточие)
    const deletePostHandler = async () => {//Хендлер кнопки удаления поста
        try{
            const accessToken = await authService.getAccessToken();
            await postService.deletePost(accessToken, postInfo.post_id); 

            setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postInfo.post_id));
            ShowMessage("Пост удалён");
        }
        catch(error){
            ShowMessage(error.message);
        }
    };

    return (<div className="settings-menu visible-settings block">
                                <button onClick={deletePostHandler}>Удалить пост</button>
                            </div>);
}

export function Post({userInfo, post, fileToken, isUserPage, setPosts})//Компонент, загрузка поста и его компонентов
{
    const [currentImage, setCurrentImage] = useState(0);
    const [postSettings, setPostSettings] = useState(null);

    let images = Object.entries(JSON.parse(post.files_types.replace(/'/g, '"')));
    
    const viewPostSettingsHandler = (event) => {
        event.stopPropagation();
        setPostSettings(<PostSettings postInfo={post} setPosts={setPosts}/>);
    };
    
    useEffect(() => {
        const handleClickOutside = () => setPostSettings(null);
        document.addEventListener("click", handleClickOutside);
        
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    return (<div className="post block">
                <div className="author-info">
                    <a href={"/user/" + userInfo.nick_name}>
                        <img className="post-author-photo" src={`${CONFIG.SITE_IP}${API.get}/${userInfo.photo_url}?token=${fileToken}`}/>
                    </a>
                    <a className="post-author-name" href={"/user/" + userInfo.nick_name}>
                        <p>{userInfo.name}</p>
                    </a>
                </div>

                <div className="content">
                    <div className="images-list">
                        {//Если загружено только одно фото, то не отрисовываем кнопку
                            images.length > 1 ? <button className="switch-image-button previous-image-button" onClick={() => setCurrentImage(currentImage > 0 ? currentImage-1 : images.length-1)}><p>&lt;</p></button> : null
                        }

                        {images.map(([fileName, fileType], index) => {
                            //Первое изображение имеет css класс selected-image, чтобы оно было единственным видимым
                            return (<div className={"image-block" + (index == currentImage ? " selected-image" : "")} key={fileName}>
                                    <img className="post-image" src={`${API.get}/posts/${fileType}/${fileName}?token=${fileToken}`}/>
                                </div>);
                        })
                        }
                        
                        {
                            images.length > 1 ? <button className="switch-image-button next-image-button" onClick={() => setCurrentImage(currentImage < images.length-1 ? currentImage+1 : 0)}><p>&gt;</p></button> : null
                        }
                    </div>
                    <p className="post-text">{post.text}</p>
                </div>

                <div className="actions-bar">
                    <LikeButton postId={post.post_id} post={post}/>
                    {isUserPage ?
                        <div className="settings-block">
                            <button className="settings-button" onClick={viewPostSettingsHandler}><p>...</p></button>
                            {postSettings}
                        </div>
                    : null}
                </div>
                <p className="post-date"><PostDate post={post}/></p>
            </div>);
}
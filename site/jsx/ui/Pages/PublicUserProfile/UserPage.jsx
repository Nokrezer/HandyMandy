import React, {useEffect, useState, useRef} from 'react';
import {Link} from "react-router";
import { API, CONFIG, STYLES} from '../../../settings/config.js';

import { PageStyler } from '../../../settings/pages.js';
import { UserPostsBlock } from '../PostsLoader/PostsLoader.js';
import {ProductsBlock} from "../ProductPage/ProductPage.js";
import {copy} from '../../../shared/clipboard.js';

import {useUserPageData} from "./useUserData.js";
 
import { setUserPhoto } from './setUserPhoto.js';
import {SubscriptionButtons} from "./SubscriptionButtons.js";

export default function UserPage()//Компонент блока с данными пользователя
{
    const userData = useUserPageData();
    const [nowPage, setNowPage] = useState(null);//хранит под страницу. Например карточки товаров или посты пользователя

    const {userInfo, fileToken, privateData, isSubscribed, userFollowers, errorText} = userData;//Деструктуризация полученных данных

    const userPostsBlockMemory = useRef(null);//Для того чтобы заново не подгружать блок с постами пользователя, храним в памяти
    const productsBlockMemory = useRef(null);

    useEffect(() => {
        if(userInfo){
            document.title = userInfo.name;
            const isUserPage = privateData.nick_name === userInfo.nick_name;//Находится ли пользователь на своей странице или нет
            userPostsBlockMemory.current = userPostsBlockMemory.current ?? <UserPostsBlock userInfo={userInfo} isUserPage={isUserPage}/>;
            productsBlockMemory.current = productsBlockMemory.current ?? <ProductsBlock userInfo={userInfo} isUserPage={isUserPage}/>;
            
            setNowPage(productsBlockMemory.current);
        }
    }, [userInfo]);

    if(!userData.userInfo)//Если вернулось null, значит страница загружается
        return <p>Загрузка</p>;

    if(errorText)
        return <p>Ошибка</p>;


    const isUserPage = privateData.nick_name === userInfo.nick_name;//Находится ли пользователь на своей странице или нет

    let subscriptionsButtons = <SubscriptionButtons myNickName={privateData.nick_name} targetNickName={userInfo.nick_name} targetUserId={userInfo.id} isSubscribed={isSubscribed}/>
    let setUserPhotoFunc = null;//Будет храниться функция, для изменения 
    let linkToCreatePage = null;
    //Если пользователь заходит на свою страницу, то даём доступ к изменению аватара и убираем кнопки подписаться/отписаться и написать сообщение
    if(isUserPage){
        subscriptionsButtons = null;
        setUserPhotoFunc = setUserPhoto;
        linkToCreatePage = <Link to="/create" className="create-href center block">Создать</Link>;
    }

    let statusesBlock = null;//Блок со статусами пользователя
    if(userInfo.statuses != null){
        const userStatuses = userInfo.statuses.split(",");
        statusesBlock = (<div className="statuses-block">
                            {userStatuses.map(status => <p className="status" key={status}>{status}</p>)}
                        </div>);
    }
    
    return (
            <div className="profile page-block">
                <PageStyler path={STYLES.userPage} id={"user-page-style"}/>
                <div id="user-info" className="center block">
                    <h3 id="user-name">{userInfo.name}</h3>
                    <img id="public-profile-image" src={`${CONFIG.SITE_IP}${API.get}/${userInfo.photo_url}?token=${fileToken}`} onClick={setUserPhotoFunc}/>
                    <p id="nick-name" onClick={() => copy(userInfo.nick_name)}>@{userInfo.nick_name}</p>
                    <p className="followers-count">Подписчиков: {Object.keys(userFollowers).length}</p>
                    <p id="bio">{userInfo.bio}</p>
                    
                    
                    {subscriptionsButtons}
                    {statusesBlock}

                    <div className="author-posts-choose-buttons">
                        <button onClick={() => setNowPage(productsBlockMemory.current)}>Карточки товаров</button>
                        <button onClick={() => setNowPage(userPostsBlockMemory.current)}>Посты пользователя</button>
                    </div>
                </div>
                {linkToCreatePage}

                {nowPage}
            </div> 
    );
}
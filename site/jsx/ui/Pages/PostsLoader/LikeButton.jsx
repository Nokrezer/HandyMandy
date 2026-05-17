import React, {useState, useEffect} from "react";

import { likeService, authService } from "../../../settings/config.js";

export function LikeButton({postId, post})//Компонент, кнопка чтобы поставить лайк
{
    const [likes, setLikes] = useState(post.likes);
    const [loading, setLoading] = useState(false);

    const btnEvent = async() => {
        if(loading) return;
        
        setLoading(true);

        const accessToken = await authService.getAccessToken();
        await likeService.setPostLike(accessToken, postId);

        const postLikes = await likeService.getPostLikes(accessToken, postId);
        
        setLikes(postLikes);
        setLoading(false);
    };

    return (<button className="like-button" onClick={btnEvent}>{likes} <img className="like" src="/img/heart.svg"/></button>);
}
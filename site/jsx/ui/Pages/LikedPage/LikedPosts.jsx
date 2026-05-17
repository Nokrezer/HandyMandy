import React, {useState, useEffect, useRef} from 'react';

import { authService, likeService } from '../../../settings/config.js';
import { STYLES } from '../../../settings/config.js';
import { Post } from '../PostsLoader/Post.js';
import { PageStyler } from '../../../settings/pages.js';

export function LikedPosts(){
    const [posts, setPosts] = useState([]);
    const [fileToken, setFileToken] = useState();
    const loadMorePosts = useRef(true);//Если true, то подгружаем посты пользователя, если false то у пользователя больше нету постов
    const isLoadingPosts = useRef(false);
    
    //Загрузка начальных постов
    useEffect(() => {(async() => {
        const accessToken = await authService.getAccessToken();
        const likedPosts = await likeService.getLikedPosts({accessToken:accessToken});
        const tmpToken = await authService.getFileToken(accessToken);
        
        setFileToken(tmpToken);
        setPosts(likedPosts);
        setFileToken(tmpToken);
    })();
    }, []);
    
    if(!posts)
        return null;
    
    return (<div id="posts">
                    <PageStyler path={STYLES.posts} id={"user-posts-style"}/>
    
                    {posts.map(post => 
                        <Post key={post.post_id} userInfo={post} post={post} fileToken={fileToken} isUserPage={false} setPosts={setPosts}/>
                    )}
                </div>);
}
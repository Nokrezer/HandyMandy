import React, {useState, useEffect} from 'react';

import { PageStyler } from '../../../settings/pages.js';

import {Post} from "../PostsLoader/Post.js";
import { postService, authService, STYLES, userService } from '../../../settings/config.js';
import { ShowMessage } from '../../ToastMessages.js';

export default function FeedPage(){
    const [feedPosts, setFeed] = useState();
    const [fileToken, setFileToken] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const accessToken = await authService.getAccessToken();
            const posts = await postService.getFeed(accessToken);
            const tmpToken = await authService.getFileToken(accessToken);
            
            setLoading(false);
            setFeed(posts);
            setFileToken(tmpToken);
        })();
    }, []);

    if(loading)
        return <div>Загрузка...</div>;
    
    return (
        <div className="feed">
            {/* <input/> */}

            <div id="posts">
                <PageStyler path={STYLES.posts} id={"user-posts-style"}/>
            
                {typeof(feedPosts) === "string" ? <div>{feedPosts}</div> 
                    :
                    feedPosts.map(post => {
                    const userInfo = {name:post.name, nick_name:post.nick_name, photo_url:post.photo_url};
                    return <Post key={post.id} userInfo={userInfo} post={post} fileToken={fileToken} isUserPage={false} posts={null} setPosts={null}/>;
                    }
                )}
            </div>
        </div>);
}
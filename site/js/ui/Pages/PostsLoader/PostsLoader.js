import React, { useEffect, useState, useRef } from 'react';
import { authService, STYLES, postService } from '../../../settings/config.js';
import { PageStyler } from '../../../settings/pages.js';
import { Post } from "./Post.js";
async function loadPosts(userInfo, postsLoaded) {
    const accessToken = await authService.getAccessToken();
    const userPosts = await postService.getUserPosts({ accessToken: accessToken, userId: userInfo.id, offset: postsLoaded });
    const tmpToken = await authService.getFileToken(accessToken);
    return { userPosts: userPosts, tmpToken: tmpToken };
}
export function UserPostsBlock({ userInfo, isUserPage }) {
    const [posts, setPosts] = useState([]);
    const [fileToken, setFileToken] = useState();
    const loadMorePosts = useRef(true); //Если true, то подгружаем посты пользователя, если false то у пользователя больше нету постов
    const isLoadingPosts = useRef(false);
    //Загрузка начальных постов
    useEffect(() => {
        (async () => {
            const { userPosts, tmpToken } = await loadPosts(userInfo, posts.length);
            setPosts(userPosts);
            setFileToken(tmpToken);
        })();
    }, [userInfo.nick_name]);
    if (!posts)
        return null;
    //Подгрузка постов
    useEffect(() => {
        if (!loadMorePosts.current)
            return;
        const handleScroll = async () => {
            if (isLoadingPosts.current)
                return;
            const clientHeight = document.documentElement.clientHeight;
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                isLoadingPosts.current = true;
                try {
                    const { userPosts, tmpToken } = await loadPosts(userInfo, posts.length);
                    loadMorePosts.current = userPosts.length > 0;
                    if (loadMorePosts.current) {
                        setPosts(prev => [...prev, ...userPosts]);
                        setFileToken(tmpToken);
                    }
                }
                catch {
                }
                finally {
                    isLoadingPosts.current = false;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [userInfo.nick_name, posts.length]);
    return (React.createElement("div", { id: "posts" },
        React.createElement(PageStyler, { path: STYLES.posts, id: "user-posts-style" }),
        posts.map(post => React.createElement(Post, { key: post.post_id, userInfo: userInfo, post: post, fileToken: fileToken, isUserPage: isUserPage, setPosts: setPosts }))));
}
function FeedPostsBlock() {
    const [posts, setPosts] = useState();
    const [fileToken, setFileToken] = useState();
    useEffect(() => {
        (async () => {
            const accessToken = await authService.getAccessToken();
            const posts = await postService.getFeed(accessToken);
            const tmpToken = await authService.getFileToken(accessToken);
            setPosts(posts);
            setFileToken(tmpToken);
        })();
    }, []);
    if (!posts)
        return null;
    return (React.createElement("div", { id: "posts" },
        React.createElement(PageStyler, { path: STYLES.posts, id: "user-posts-style" }),
        posts.map(post => React.createElement(Post, { key: post.id, userInfo: userInfo, post: post, fileToken: fileToken, isUserPage: isUserPage, posts: posts, setPosts: setPosts }))));
    ;
}

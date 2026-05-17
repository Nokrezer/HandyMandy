import React, { useState, useEffect } from 'react';
import { PageStyler } from '../../../settings/pages.js';
import { Post } from "../PostsLoader/Post.js";
import { postService, authService, STYLES, userService } from '../../../settings/config.js';
import { ShowMessage } from '../../ToastMessages.js';
export default function FeedPage() {
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
    if (loading)
        return React.createElement("div", null, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...");
    return (React.createElement("div", { className: "feed" },
        React.createElement("div", { id: "posts" },
            React.createElement(PageStyler, { path: STYLES.posts, id: "user-posts-style" }),
            typeof (feedPosts) === "string" ? React.createElement("div", null, feedPosts)
                :
                    feedPosts.map(post => {
                        const userInfo = { name: post.name, nick_name: post.nick_name, photo_url: post.photo_url };
                        return React.createElement(Post, { key: post.id, userInfo: userInfo, post: post, fileToken: fileToken, isUserPage: false, posts: null, setPosts: null });
                    }))));
}

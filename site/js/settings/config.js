import React from 'react';
import { Navigate } from "react-router";
// const {Navigate} = window;
import { LoginPage, Chat, ChatPage, LikedPage, CatalogPage, RegistrationPage, CreatePostPage, UserPage, SettingsPage, FeedPage, ProductInfoPage } from "/js/settings/pages.js";
import { RequestService } from '../services/RequestService.js';
import { AuthService } from '../services/AuthService.js';
import { LikeService } from '../services/LikeService.js';
import { PostService } from '../services/PostService.js';
import { SubscribeService } from '../services/SubscribeService.js';
import { UserService } from '../services/UserService.js';
import { ProductService } from '../services/ProductService.js';
import { MessengerService } from '../services/MessengerService.js';
//Общий конфиг
export const CONFIG = {
    SITE_IP: "https://192.168.31.168:5000",
    MESSENGER_IP: "wss://192.168.31.168:8000"
};
//Api для запроса к стилям
export const STYLES = {
    menuBar: CONFIG.SITE_IP + "/styles/user_button_bar.css",
    userPage: CONFIG.SITE_IP + "/styles/user_page.css",
    posts: CONFIG.SITE_IP + "/styles/user_posts.css",
    uploadPost: CONFIG.SITE_IP + "/styles/upload_post.css",
    productCards: CONFIG.SITE_IP + "/styles/product_cards.css",
    productInfoPage: CONFIG.SITE_IP + "/styles/product_page.css",
    catalogPage: CONFIG.SITE_IP + "/styles/catalog_page.css",
    likedPage: CONFIG.SITE_IP + "/styles/liked_page.css",
    chats: CONFIG.SITE_IP + "/styles/chats.css"
};
//api работа с мессенджером
export const MESSENGER_API = {
    getChats: "getChats",
    sendMessage: "sendMessage",
    getChatMessages: "getChatMessages",
    auth: "auth"
};
//Api работы с пользователями/данными
export const API = {
    get: "/api/get",
    privateUserData: "/api/getPrivateUserData",
    publicUserData: "/api/getPublicUserData",
    userId: "/api/getUserId",
    userPosts: "/api/getUserPosts",
    setLike: "/api/setPostLike",
    postLikes: "/api/getPostLikes",
    setSubscribe: "/api/setSubscribe",
    getSubscribe: "/api/getSubscribe",
    createNewPost: "/api/createPost",
    setProfilePhoto: "/api/setProfilePhoto",
    setUserData: "/api/setUserData",
    setPassword: "/api/setPassword",
    setEmail: "/api/setEmail",
    deletePost: "/api/removePost",
    getFeed: "/api/getFeed",
    getPostOwnerId: "/api/getPostOwnerId",
    getUserFollowers: "/api/getUserFollowers",
    getUserProducts: "/api/getUserProducts",
    removeProduct: "/api/removeProduct",
    createNewProduct: "/api/createProduct",
    setProductLike: "/api/setProductLike",
    getUserLikedProducts: "/api/getUserLikedProducts",
    setProductArchive: "/api/setProductArchive",
    getProductInfo: "/api/getProductInfo",
    getLatestProducts: "/api/getLatestProducts",
    searchProducts: "/api/searchProducts",
    getLikedPosts: "/api/getLikedPosts",
    getLikedProducts: "/api/getLikedProducts",
    getProductLikes: "/api/getProductLikes"
};
//Api авторизации
export const AUTH = {
    login: "/auth/login",
    registration: "/auth/registration",
    verifyToken: "/auth/verifyToken",
    fileToken: "/auth/getTempToken",
    updateTokens: "/auth/updateTokens",
    updateAccessToken: "/auth/updateAccessToken"
};
export const PAGES = {
    user: "/user/",
};
export const ROUTES = [
    // {path: "/main", element: <Creations/>},
    // {path: "/feed", element: <FeedPage/>},
    // {path: "/creations", element: <Creations/>},
    { path: "/user/:nickName", element: React.createElement(UserPage, null) },
    { path: "/login", element: React.createElement(LoginPage, null) },
    { path: "/registration", element: React.createElement(RegistrationPage, null) },
    { path: "/create", element: React.createElement(CreatePostPage, null) },
    { path: "/settings", element: React.createElement(SettingsPage, null) },
    { path: "*", element: React.createElement(Navigate, { to: "/catalog", replace: true }) },
    { path: "/product/:productId", element: React.createElement(ProductInfoPage, null) },
    { path: "/catalog", element: React.createElement(CatalogPage, null) },
    { path: "/liked", element: React.createElement(LikedPage, null) },
    { path: "/messenger", element: React.createElement(ChatPage, null) },
    { path: "/messenger/chat/:userId", element: React.createElement(Chat, null) },
    // {path: "/messenger/chat/user/:userId", element: <Chat/>}
];
export const requestService = new RequestService();
export const userService = new UserService(requestService);
export const subscribeService = new SubscribeService(requestService);
export const postService = new PostService(requestService);
export const likeService = new LikeService(requestService);
export const authService = new AuthService(requestService);
export const productService = new ProductService(requestService);
let messengerService;
try {
    messengerService = new MessengerService();
}
catch {
    messengerService = null;
}
export { messengerService };
export const MONTHS_CODES = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

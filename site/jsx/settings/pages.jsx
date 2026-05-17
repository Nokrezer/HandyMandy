import React, {lazy} from 'react';

// import {LoginPage} from '/js/ui/Pages/Forms/LoginPage.js';
// import {RegistrationPage} from '/js/ui/Pages/Forms/RegistrationPage.js';
// import {CreatePostPage} from "/js/ui/Pages/CreatePost/CreatePostPage.js";
// import {UserPage} from "/js/ui/Pages/PublicUserProfile/UserPage.js";
// import {SettingsPage} from "/js/ui/Pages/UserSettings/SettingsPage.js";
// import {FeedPage} from "/js/ui/Pages/Feed/FeedPage.js";
// import React from 'react'

// Теперь React доступен
// const { lazy } = React
// export {FeedPage, LoginPage, RegistrationPage, CreatePostPage, UserPage, SettingsPage};
export const LoginPage = lazy(() => import("/js/ui/Pages/Forms/LoginPage.js"));
export const RegistrationPage = lazy(() => import('/js/ui/Pages/Forms/RegistrationPage.js'));
export const CreatePostPage = lazy(() => import("/js/ui/Pages/CreatePostProduct/CreatePostPage.js"));
export const UserPage = lazy(() => import("/js/ui/Pages/PublicUserProfile/UserPage.js"));
export const SettingsPage = lazy(() => import("/js/ui/Pages/UserSettings/SettingsPage.js"));
export const FeedPage = lazy(() => import("/js/ui/Pages/Feed/FeedPage.js"));
export const ProductInfoPage = lazy(() => import("/js/ui/Pages/ProductPage/ProductInfoPage.js"));
export const CatalogPage = lazy(() => import("/js/ui/Pages/CatalogPage/CatalogPage.js"));
export const LikedPage = lazy(() => import("/js/ui/Pages/LikedPage/LikedPage.js"));
export const ChatPage = lazy(() => import("/js/ui/Pages/Chat/ChatPage.js"));
export const Chat = lazy(() => import("/js/ui/Pages/Chat/Chat.js"));

export const Layout = lazy(() => import("/js/ui/Layout.js"));
export const UserMenuBar = lazy(() => import("/js/ui/MenuBar.js"));
export const PageStyler = lazy(() => import("/js/ui/Styler.js"));
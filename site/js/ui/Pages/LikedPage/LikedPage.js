import React, { useState, useEffect, useRef } from 'react';
import { LikedPosts } from "./LikedPosts.js";
import { LikedProducts } from "./LikedProducts.js";
import { STYLES } from '../../../settings/config.js';
import { PageStyler } from '../../../settings/pages.js';
export default function LikedPage() {
    const [nowPage, setNowPage] = useState(React.createElement(LikedPosts, null));
    useEffect(() => {
        document.title = "Понравившиеся";
    }, []);
    return (React.createElement("div", { className: "page-block" },
        React.createElement(PageStyler, { path: STYLES.likedPage }),
        React.createElement("div", { className: "select-liked-page" },
            React.createElement("button", { onClick: () => setNowPage(React.createElement(LikedPosts, null)) }, "\u041F\u043E\u0441\u0442\u044B"),
            React.createElement("button", { onClick: () => setNowPage(React.createElement(LikedProducts, null)) }, "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0442\u043E\u0432\u0430\u0440\u043E\u0432")),
        nowPage));
}

import React, { useState, useEffect } from "react";
import { likeService, authService } from "../../../settings/config.js";
export function LikeButton({ productId, product }) {
    const [loading, setLoading] = useState(false);
    const [likes, setLikes] = useState(product.likes);
    const btnEvent = async (e) => {
        e.preventDefault();
        if (loading)
            return;
        setLoading(true);
        const accessToken = await authService.getAccessToken();
        await likeService.setProductLike(accessToken, productId);
        const productLikes = await likeService.getProductLikes(accessToken, productId);
        setLikes(productLikes);
        setLoading(false);
    };
    return (React.createElement("button", { className: "like-button", onClick: btnEvent },
        likes,
        " ",
        React.createElement("img", { className: "like", src: "/img/heart.svg" })));
}

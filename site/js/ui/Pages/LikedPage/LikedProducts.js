import React, { useState, useEffect, useRef } from 'react';
import { authService, likeService } from '../../../settings/config.js';
import { STYLES } from '../../../settings/config.js';
import { ProductCard } from '../ProductPage/ProductCard.js';
import { PageStyler } from '../../../settings/pages.js';
export function LikedProducts() {
    const [products, setProducts] = useState([]);
    const [fileToken, setFileToken] = useState();
    const loadMoreProducts = useRef(true); //Если true, то подгружаем посты пользователя, если false то у пользователя больше нету постов
    const isLoadingProducts = useRef(false);
    //Загрузка начальных постов
    useEffect(() => {
        (async () => {
            const accessToken = await authService.getAccessToken();
            const likedProducts = await likeService.getLikedProducts({ accessToken: accessToken });
            const tmpToken = await authService.getFileToken(accessToken);
            setFileToken(tmpToken);
            setProducts(likedProducts);
            setFileToken(tmpToken);
        })();
    }, []);
    if (!products)
        return null;
    return (React.createElement("div", { id: "products" },
        React.createElement(PageStyler, { path: STYLES.productCards, id: "products-style" }),
        products.map(product => React.createElement(ProductCard, { key: product.product_id, product: product, fileToken: fileToken, isUserPage: false, setProducts: setProducts }))));
}

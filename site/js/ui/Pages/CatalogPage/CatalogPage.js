import React, { useState, useEffect, useRef } from "react";
import { productService, authService, STYLES } from "../../../settings/config.js";
import { PageStyler } from "../../../settings/pages.js";
import { ProductCard } from "../ProductPage/ProductCard.js";
async function loadLatestProducts() {
    const accessToken = await authService.getAccessToken();
    const latestProducts = await productService.getLatestProducts(accessToken);
    const tmpToken = await authService.getFileToken(accessToken);
    return { latestProducts: latestProducts, tmpToken: tmpToken };
}
// async function searchProducts(setProducts){
//     setProducts();
// }
export default function CatalogPage() {
    const [products, setProducts] = useState([]);
    const [fileToken, setFileToken] = useState();
    const loadMoreProducts = useRef(true);
    const isLoadingProducts = useRef(false);
    //начальная загрузка карточек товаров
    useEffect(() => {
        (async () => {
            document.title = "Каталог";
            document.addEventListener('keydown', async (event) => {
                if (event.key === 'Enter') {
                    const searchText = document.getElementById("search-product").value;
                    const accessToken = await authService.getAccessToken();
                    const findedProducts = await productService.searchProducts(accessToken, searchText);
                    setProducts(findedProducts);
                }
            });
            const { latestProducts, tmpToken } = await loadLatestProducts();
            setProducts(latestProducts);
            setFileToken(tmpToken);
        })();
    }, []);
    if (!products)
        return null;
    return (React.createElement("div", { className: "page-block" },
        React.createElement(PageStyler, { path: STYLES.productCards, id: "user-product-cards-style" }),
        React.createElement(PageStyler, { path: STYLES.catalogPage, id: "catalog-page-style" }),
        React.createElement("input", { id: "search-product" }),
        React.createElement("p", { className: "latest-masters-text" }, "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u044B \u043C\u0430\u0441\u0442\u0435\u0440\u043E\u0432"),
        products.map(product => React.createElement(ProductCard, { key: product.product_id, product: product, fileToken: fileToken, isUserPage: false, setProducts: setProducts }))));
}

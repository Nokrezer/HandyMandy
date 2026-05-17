import React, { useState, useEffect } from "react";
import { productService, authService, CONFIG, API } from "../../../settings/config.js";
import { ShowMessage } from '../../ToastMessages.js';
import { LikeButton } from "./LikeButton.js";
function ProductSettings({ productInfo, setProducts }) {
    const deleteProductHandler = async (event) => {
        event.preventDefault();
        try {
            const accessToken = await authService.getAccessToken();
            await productService.deleteProduct(accessToken, productInfo.product_id);
            setProducts(prevproducts => prevproducts.filter(product => product.product_id !== productInfo.product_id));
            ShowMessage("Карточка удалена");
        }
        catch (error) {
            ShowMessage(error.message);
        }
    };
    return (React.createElement("div", { className: "settings-menu visible-settings block" },
        React.createElement("button", { onClick: deleteProductHandler }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443")));
}
export function ProductCard({ product, fileToken, isUserPage, setProducts }) {
    const [productSettings, setProductsettings] = useState(null);
    const mainImage = Object.entries(JSON.parse(product.files_types.replace(/'/g, '"')))[0];
    const viewProductSettingsHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setProductsettings(React.createElement(ProductSettings, { productInfo: product, setProducts: setProducts }));
    };
    useEffect(() => {
        const handleClickOutside = () => setProductsettings(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    return (React.createElement("a", { className: "product-card block", href: `/product/${product.product_id}` },
        React.createElement("div", { className: "content" },
            React.createElement("div", { className: "main-image" },
                React.createElement("img", { src: `${API.get}/products/${mainImage[1]}/${mainImage[0]}?token=${fileToken}` })),
            React.createElement("p", { className: "product-text" }, product.text)),
        React.createElement("div", { className: "actions-bar" },
            isUserPage ?
                React.createElement("div", { className: "settings-block" },
                    React.createElement("button", { className: "settings-button", onClick: viewProductSettingsHandler },
                        React.createElement("p", null, "...")),
                    productSettings)
                : null,
            React.createElement(LikeButton, { productId: product.product_id, product: product }))));
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router";
import { productService, authService, API, STYLES } from "../../../settings/config.js";
import { Layout, PageStyler } from '../../../settings/pages.js';
export default function ProductInfoPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [productInfo, setProductInfo] = useState();
    const [currentImage, setCurrentImage] = useState(0);
    const [fileToken, setFileToken] = useState();
    useEffect(() => {
        (async () => {
            const accessToken = await authService.getAccessToken();
            const prodInfo = await productService.getProductInfo(accessToken, productId);
            const token = await authService.getFileToken(accessToken);
            setFileToken(token);
            setProductInfo(prodInfo);
            setLoading(false);
        })();
    }, []);
    if (loading)
        return React.createElement("p", null, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...");
    const images = Object.entries(JSON.parse(productInfo.files_types.replace(/'/g, '"')));
    const statuses = productInfo.product_statuses.split(",");
    return React.createElement(Layout, null,
        React.createElement(PageStyler, { path: STYLES.productInfoPage, id: "product-page-style" }),
        React.createElement("div", { className: "product-info page-block" },
            React.createElement("div", { className: "images-list" }, //Если загружено только одно фото, то не отрисовываем кнопку
                images.length > 1 ? React.createElement("button", { className: "switch-image-button previous-image-button", onClick: () => setCurrentImage(currentImage > 0 ? currentImage - 1 : images.length - 1) },
                    React.createElement("p", null, "<")) : null,
                images.map(([fileName, fileType], index) => {
                    //Первое изображение имеет css класс selected-image, чтобы оно было единственным видимым
                    return (React.createElement("div", { className: "image-block" + (index == currentImage ? " selected-image" : ""), key: fileName },
                        React.createElement("img", { className: "product-image", src: `${API.get}/products/${fileType}/${fileName}?token=${fileToken}` })));
                }),
                images.length > 1 ? React.createElement("button", { className: "switch-image-button next-image-button", onClick: () => setCurrentImage(currentImage < images.length - 1 ? currentImage + 1 : 0) },
                    React.createElement("p", null, ">")) : null),
            React.createElement("div", { className: "about-product" },
                React.createElement("p", { className: "" },
                    "\u0426\u0435\u043D\u0430: ",
                    productInfo.price),
                React.createElement("p", null, "\u041E \u0438\u0437\u0434\u0435\u043B\u0438\u0438:"),
                React.createElement("div", { className: "statuses-block" }, statuses.map(status => React.createElement("p", { className: "status", key: status }, status)))),
            React.createElement("button", { className: "send-message", onClick: () => navigate("/messenger/chat/" + productInfo.user_id) }, "\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u043C")));
}

import React, {useState, useEffect} from "react";

import { productService, authService, CONFIG, API } from "../../../settings/config.js";

import { ShowMessage } from '../../ToastMessages.js';
import {LikeButton} from "./LikeButton.js";

function ProductSettings({productInfo, setProducts}){//Настройки поста(при нажатии на троеточие)
    const deleteProductHandler = async (event) => {//Хендлер кнопки удаления поста
        event.preventDefault();
        try{
            const accessToken = await authService.getAccessToken();
            await productService.deleteProduct(accessToken, productInfo.product_id); 

            setProducts(prevproducts => prevproducts.filter(product => product.product_id !== productInfo.product_id));
            ShowMessage("Карточка удалена");
        }
        catch(error){
            ShowMessage(error.message);
        }
    };

    return (<div className="settings-menu visible-settings block">
                                {/* <button onClick={deleteProductHandler}>Добавить в арх</button> */}
                                <button onClick={deleteProductHandler}>Удалить карточку</button>
                            </div>);
}

export function ProductCard({product, fileToken, isUserPage, setProducts})//Компонент, загрузка карточки товара и его компонентов
{
    const [productSettings, setProductsettings] = useState(null);

    const mainImage = Object.entries(JSON.parse(product.files_types.replace(/'/g, '"')))[0];

    const viewProductSettingsHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setProductsettings(<ProductSettings productInfo={product} setProducts={setProducts}/>);
    };

    useEffect(() => {
        const handleClickOutside = () => setProductsettings(null);
        document.addEventListener("click", handleClickOutside);
        
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (<a className="product-card block" href={`/product/${product.product_id}`}>
                <div className="content">
                    <div className="main-image">
                        <img src={`${API.get}/products/${mainImage[1]}/${mainImage[0]}?token=${fileToken}`}/>
                    </div>

                    <p className="product-text">{product.text}</p>
                </div>

                <div className="actions-bar">
                    
                    {isUserPage ?
                        <div className="settings-block">
                            <button className="settings-button" onClick={viewProductSettingsHandler}><p>...</p></button>
                            {productSettings}
                        </div>
                    : null}

                    <LikeButton productId={product.product_id} product={product}/>
                </div>
            </a>);
}
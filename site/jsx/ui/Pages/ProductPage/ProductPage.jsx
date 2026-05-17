import React, {useEffect, useState, useRef} from 'react';

import {authService, STYLES, productService} from '../../../settings/config.js';
import { PageStyler } from '../../../settings/pages.js';

import {ProductCard} from "./ProductCard.js";

async function loadProducts(userInfo, productsLoaded){
    const accessToken = await authService.getAccessToken();
    const userProducts = await productService.getUserProducts({accessToken:accessToken, userId:userInfo.id, offset:productsLoaded});

    const tmpToken = await authService.getFileToken(accessToken);

    return {userProducts:userProducts, tmpToken:tmpToken};
}

export function ProductsBlock({userInfo, isUserPage})//Компонент, загрузка карточек товаров пользователя
{
    const [products, setProducts] = useState([]);
    const [fileToken, setFileToken] = useState();
    const loadMoreProducts = useRef(true);
    const isLoadingProducts = useRef(false);

    //начальная загрузка карточек товаров
    useEffect(() => {(async() => {
        const {userProducts, tmpToken} = await loadProducts(userInfo, products.length);

        setProducts(userProducts);
        setFileToken(tmpToken);
    })();
    }, [userInfo.nick_name]);

    if(!products)
        return null;

    //Подгрузка карточек товаров
    useEffect(() => {
        if (!loadMoreProducts.current) return;
            
        const handleScroll = async () => {
            if (isLoadingProducts.current) return;

            const clientHeight = document.documentElement.clientHeight;
                const scrollTop = document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight;
                    
                if (scrollTop + clientHeight >= scrollHeight - 10) {
                    isLoadingProducts.current = true;
                    
                    try {
                        const {userProducts, tmpToken} = await loadProducts(userInfo, products.length);
                        loadMoreProducts.current = userProducts.length > 0;
                        
                        if (loadMoreProducts.current) {
                            setProducts(prev => [...prev, ...userProducts]);
                            setFileToken(tmpToken);
                        }
                    } catch{
                    } finally {
                        isLoadingProducts.current = false;
                    }
                }
            };
            
            window.addEventListener('scroll', handleScroll);
            
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }, [userInfo.nick_name, products.length]);
    
    return (<div className="products">
                <PageStyler path={STYLES.productCards} id={"user-product-cards-style"}/>

                {products.map(product => 
                    <ProductCard key={product.product_id} product={product} fileToken={fileToken} isUserPage={isUserPage} setProducts={setProducts}/>
                )}
            </div>);
}

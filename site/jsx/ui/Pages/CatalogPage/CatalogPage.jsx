import React, {useState, useEffect, useRef} from "react";

import { productService, authService, STYLES } from "../../../settings/config.js";
import { PageStyler } from "../../../settings/pages.js";
import { ProductCard } from "../ProductPage/ProductCard.js";

async function loadLatestProducts(){
    const accessToken = await authService.getAccessToken();
    const latestProducts = await productService.getLatestProducts(accessToken);
    
    const tmpToken = await authService.getFileToken(accessToken);

    return {latestProducts:latestProducts, tmpToken:tmpToken};
}

// async function searchProducts(setProducts){
//     setProducts();
// }

export default function CatalogPage(){
    const [products, setProducts] = useState([]);
    const [fileToken, setFileToken] = useState();
    const loadMoreProducts = useRef(true);
    const isLoadingProducts = useRef(false);
    
    //начальная загрузка карточек товаров
    useEffect(() => {(async() => {
        document.title = "Каталог";
        document.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter'){
                const searchText = document.getElementById("search-product").value;
                
                const accessToken = await authService.getAccessToken();
                const findedProducts = await productService.searchProducts(accessToken, searchText);
                
                setProducts(findedProducts);
            }
        });

        const {latestProducts, tmpToken} = await loadLatestProducts();

        setProducts(latestProducts);
        setFileToken(tmpToken);
    })();
    }, []);

    if(!products)
        return null;
    
    return (
        <div className="page-block">
            <PageStyler path={STYLES.productCards} id={"user-product-cards-style"}/>
            <PageStyler path={STYLES.catalogPage} id={"catalog-page-style"}/>
            
            <input id="search-product"/>
            <p className="latest-masters-text">Последние работы мастеров</p>
            {products.map(product => 
                <ProductCard key={product.product_id} product={product} fileToken={fileToken} isUserPage={false} setProducts={setProducts}/>
            )}
        </div>
    );
}
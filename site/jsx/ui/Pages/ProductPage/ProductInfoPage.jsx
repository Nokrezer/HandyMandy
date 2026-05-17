import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from "react-router";
import { productService, authService, API, STYLES } from "../../../settings/config.js";
import { Layout, PageStyler } from '../../../settings/pages.js';

export default function ProductInfoPage(){
    const {productId} = useParams();
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
        })();}, []);

    if(loading)
        return <p>Загрузка...</p>;
    
    const images = Object.entries(JSON.parse(productInfo.files_types.replace(/'/g, '"')));
    const statuses = productInfo.product_statuses.split(",");

    return <Layout>
        <PageStyler path={STYLES.productInfoPage} id={"product-page-style"}/>
        <div className="product-info page-block">
            <div className="images-list">
                {//Если загружено только одно фото, то не отрисовываем кнопку
                    images.length > 1 ? <button className="switch-image-button previous-image-button" onClick={() => setCurrentImage(currentImage > 0 ? currentImage-1 : images.length-1)}><p>&lt;</p></button> : null
                }
                {images.map(([fileName, fileType], index) => {
                    //Первое изображение имеет css класс selected-image, чтобы оно было единственным видимым
                    return (<div className={"image-block" + (index == currentImage ? " selected-image" : "")} key={fileName}>
                            <img className="product-image" src={`${API.get}/products/${fileType}/${fileName}?token=${fileToken}`}/>
                        </div>);
                })
                }
                {
                    images.length > 1 ? <button className="switch-image-button next-image-button" onClick={() => setCurrentImage(currentImage < images.length-1 ? currentImage+1 : 0)}><p>&gt;</p></button> : null
                }
            </div>

            <div className="about-product">
                <p className="">Цена: {productInfo.price}</p>

                <p>О изделии:</p>

                <div className="statuses-block">
                    {statuses.map(status => <p className="status" key={status}>{status}</p>)}
                </div>
            </div>

            <button className="send-message" onClick={() => navigate("/messenger/chat/" + productInfo.user_id)}>Связаться с продавцом</button>
        </div>
    </Layout>;
}
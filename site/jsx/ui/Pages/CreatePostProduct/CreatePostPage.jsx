import React, {useState, useEffect} from 'react';

import { STYLES } from '../../../settings/config.js';
import { PageStyler } from '../../../settings/pages.js';
import {fileChooser} from "./fileChooser.js";
import {Post} from "./Post.js";
import { sendFiles } from './sendPost.js';
import { sendProduct } from './sendProduct.js';

//Хендлеры для обработки загрузки фотографий при скидывании на элемент или на его нажатии
function dropHandler(event){
    event.stopPropagation();
    event.preventDefault();

    files = event.dataTransfer.files;
}
//Хендлер - заглушка
function dragEvents(event){
    event.preventDefault();
    event.stopPropagation();
}

//Компоненты
function DropFiles({files, setFiles}){//Компонент для сброса файлов или для показывания загруженных фото
    const [result, setResult] = useState();

    useEffect(() => {
        if(files.length > 0){//Если загружены изображения, то показываем их
            setResult(<Post files={files} setFiles={setFiles}/>);
        }
        else{//Если не загружены, то показываем загрузку изображений
            setResult(<div id="drag-files-block" onClick={async () => await fileChooser(files, setFiles)} onDrop={dropHandler} onDragEnter={dragEvents} onDragOver={dragEvents}>
                            <p className="upload-text">Загрузить фотографии</p>
                        </div>);
        }
    }, [files]);

    return result;
}

export default function CreatePostPage()//Компонент. Страница для публикации постов или карточек товаров
{
    const [files, setFiles] = useState([]);
    const [productInfoWidget, setProductWidget] = useState();

    useEffect(() => {
        document.title = "Создать";
    }, []);

    const onProductRadioHandler = () => {
        setProductWidget(<div className="product-settings-upload block center">
            <p>Цена:</p>
            <input id="product-price-input"/>
            <p>Характеристики товара(через запятую):</p>
            <input id="about-product-input"/>
        </div>);
    };

    const onPostRadioHandler = () => {
        setProductWidget(null);
    };
    
    const sendEventHandler = async () => {
        if(document.getElementById("post-choose").checked)
            await sendFiles(files, setFiles);
        else if(document.getElementById("product-choose").checked)
            await sendProduct(files, setFiles);
    };
    
    return (
            <div className="page-block">
                <PageStyler path={STYLES.posts} id={"user-posts-style"}/>
                <PageStyler path={STYLES.uploadPost} id={"create-post-page-style"}/>

                <div className="upload-block center">
                    <DropFiles files={files} setFiles={setFiles}/>

                    <div className="choose-create block">
                        <input type="radio" id="post-choose" name="select-create" onChange={onPostRadioHandler} defaultChecked/>
                        <label htmlFor="post-choose">Создать пост</label>
                        <input type="radio" id="product-choose" name="select-create" onChange={onProductRadioHandler}/>
                        <label htmlFor="product-choose">Создать карточку товара</label>
                    </div>

                    {productInfoWidget}
                    
                    <div className="other-info-post">
                        <textarea id="text-input"/>
                        <button id="upload-post" onClick={sendEventHandler}>Создать</button>
                    </div>
                </div>

                
            </div>
    );
}
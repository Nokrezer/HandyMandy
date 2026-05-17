import React, {useState, useEffect, useRef} from 'react';

import {LikedPosts} from "./LikedPosts.js";
import {LikedProducts} from "./LikedProducts.js";
import { STYLES } from '../../../settings/config.js';
import { PageStyler } from '../../../settings/pages.js';

export default function LikedPage(){
    const [nowPage, setNowPage] = useState(<LikedPosts/>);

    useEffect(() => {
            document.title = "Понравившиеся";
        }, []);

    return (
        <div className="page-block">
            <PageStyler path={STYLES.likedPage}/>
            <div className="select-liked-page">
                <button onClick={() => setNowPage(<LikedPosts/>)}>Посты</button>
                <button onClick={() => setNowPage(<LikedProducts/>)}>Карточки товаров</button>
            </div>

            {nowPage}
        </div>);
}
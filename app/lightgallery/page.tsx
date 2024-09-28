"use client"
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
//import plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function LightGalleryPage(){
    const lightGallery = useRef<any>(null);
    ///////////////////
    const [items,setItems]=useState([{
        id:'1',
        src:"/userData/profiles/choco.jpg"
    }]);
    //////////////////
    const addItem=useCallback(()=>{
        setItems([{
            id:'1',
        src:"/userData/profiles/choco.jpg"
        },{
            id:'1',
        src:"/userData/profiles/choco.jpg"
        }])
    },[]);
    /////////////
    const onInit = useCallback((detail:any) => {
        if (detail) {
            lightGallery.current = detail.instance;
        }
    }, []);
    ///////////////////////
    const getItems = useCallback(() => {
        return items.map((item) => {
            return (
                <div
                    key={item.id}
                    
                    className="gallery-item"
                    data-src={item.src}
                >
                    <img className="img-responsive" src={item.src} />
                </div>
            );
        });
    }, [items]);
    useEffect(() => {
        lightGallery.current.refresh();
    }, [items]);
    return(
        <main>
            <button onClick={()=>addItem()}>Add new Item</button>
            <h1 className="text-center">Lightgallery Page</h1>
            <div className="App w-ful p-10">
            <LightGallery
                onInit={onInit}
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
            >
                <a href="/userData/profiles/choco.jpg">
                    <img alt="img1" src="/userData/profiles/choco.jpg" />
                </a>
                {getItems()}
               
            </LightGallery>
            </div>
        </main>
    )
}














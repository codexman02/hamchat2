// import styles
import Head from "next/head";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import LightGallery from "lightgallery/react";
// import pdfjsLib from "pdfjs-dist"
//import plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { useEffect, useState } from "react";
import Link from "next/link";
import {TransformWrapper,TransformComponent,useControls} from "react-zoom-pan-pinch"
import EditIcon from "../snippets/EditIcon";
import DeleteIcon from "../snippets/deleteIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import {getDocument} from "pdfjs-dist"
type props = {
   ele:any,
   same:boolean,
   index?:number,
   modal:(id:string,type:"edit" | "delete")=>void,
   profile?:string,
   
};
type props2 = {
   ele:any,
   
   index?:number,
 
   profile?:string,
   closeZoom:any
};

const Controls = (props:props2) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <>
    <div className="tools w-full  items-center hidden justify-center px-10 relative z-40" id={`${props.ele.image.src}/controls`}>
    <div className="w-full grow">
    <button className="text-white font-semibold text-3xl my-2 mx-3" onClick={() => zoomIn()}>+</button>
      <button className="text-white font-semibold text-3xl my-2 mx-3" onClick={() => zoomOut()}>-</button>
      <button className="text-white font-semibold text-3xl my-2 mx-3" onClick={() => resetTransform()}>x</button>
    </div>
    <div className="ml-5 text-lg bg-black text-white font-light px-4 py-2 rounded-xl cursor-pointer " onClick={()=>{props.closeZoom(props.ele.image.src), resetTransform()}}>Close</div>
    </div>
   
    </>
  );
};

function fileContainer(type: string, ele2: any,pdfSrc:string | null,setPdfSrc:any,isZoom:boolean,setIsZoom:any) {
 

  function fullScreen(e:string){
    console.log(isZoom)
    let ele=document.getElementById(e);

    if(!isZoom){
    ele?.setAttribute("class","fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center bg-gray-500 py-6")
    let control=document.getElementById(`${e}/controls`)
    control!.style.display="flex"
    // console.log(control)
    setIsZoom(true)
    }
   
  
    // console.log(e)
    
   
  }
  function closeZoom(e:any){

    setIsZoom(false);

    console.log("zoom closed",isZoom)
    let ele=document.getElementById(e)
    // console.log(ele)
    ele?.setAttribute("class","w-1/2 flex flex-col justify-center items-center overflow-hidden rounded-3xl")
   let control=document.getElementById(`${e}/controls`);
   control!.style.display="none"
   setIsZoom(false)
  }
  
  async function pdfMakers(ele2:any){
    //@ts-ignore
    let pdfDoc=await pdfjsLib.getDocument(ele2.image.src).promise
    const page = await pdfDoc.getPage(1);
    // var viewport = page.getViewport({ scale: scale })
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width =(viewport.width);
canvas.height = 250;
const renderContext = {
   canvasContext: context,
   viewport: viewport,
};
{/* 
  // @ts-ignore*/}
let renderTask=await page.render(renderContext).promise
  const imgDataUrl = canvas.toDataURL('image/png');
setPdfSrc(imgDataUrl)
  }
  const onInit = () => {
    // console.log("lightGallery has been initialized");
  };


  if (type.startsWith("image/")) {
    return (
      <div className="w-full flex flex-col justify-center items-center overflow-hidden rounded-3xl  " id={ele2.image.src} onClick={()=>fullScreen(ele2.image.src)}>

        <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}>
        {({zoomIn,zoomOut,resetTransform,...rest})=>(
            <div className="flex flex-col justify-center items-center w-full h-full"> 
           <Controls closeZoom={closeZoom} ele={ele2} />
            <TransformComponent>

            <img alt="img1" src={ele2.image.src} />
         
           </TransformComponent>
           </div>
        )}
        </TransformWrapper>
      </div>
    );
  } else if (type.startsWith("application/pdf")) {
  // useEffect(()=>{
  //  pdfMakers(ele2)
  // },[])
  pdfMakers(ele2)
    return(<>
    <div className="w-full flex justify-center items-center overflow-hidden rounded-2xl border border-solid border-gray-200 bg-gray-600 text-white"><Link href={ele2.image.src} target="_blank" className=" w-full h-full flex items-center justify-center flex-col  overflow-hidden">
      {pdfSrc && (<><img src={pdfSrc} className="w-auto h-full object-cover "  height={250} alt="image"/>
      <p className="w-full text-center">{ele2.image.name}</p></>)}
      </Link></div>
  
    </>);
  }else if(type.startsWith("video/")){
   return(
    <>
     <div className="w-1/2 flex justify-center items-center overflow-hidden rounded-3xl">
      <video src={ele2.image.src} controls></video>
    </div>
  
    </>
   )
}else if(type.startsWith("audio/")){
return(
  <div className="w-1/2 flex justify-center items-center overflow-hidden rounded-3xl shadow-md">
    <audio controls className="w-full" >
      <source src={ele2.image.src} />
    </audio>
  </div>
)
}
}
export default function MessageComponent({ele,same,index,modal,profile}:props) {
  let [isZoom,setIsZoom]=useState(false)
let [pdfSrc,setPdfSrc]=useState(null);
  function checkMouse(){
    let ele=document.querySelector(`.options_${index}`);
    ele?.classList.remove("hidden");
    ele?.classList.add("flex");
    // console.log(index,"moved in");
  }
  function leaveMouse(){
    let ele=document.querySelector(`.options_${index}`);
    ele?.classList.remove("flex");
    ele?.classList.add("hidden");
    // console.log(index,"mouse agay")
  }
  function edit(id:string){
modal(id,"edit");
    console.log(id,"test");
  }
  function deleteMessage(id:string){
    modal(id,"delete")
    console.log("delted");
  }
  return ( 
  <>
    {ele.content?(<>
       {same?(<><div className="flex  w-full h-auto bg-gray-600  text-white shadow-md overflow-hidden rounded-xl relative" onMouseEnter={()=>{checkMouse()}} onMouseLeave={()=>{leaveMouse()}}>
       <Avatar className="my-auto mx-2 object-cover">
                    <AvatarImage className="object-cover" src={profile}/>
                    <AvatarFallback className="text-black">{ele.sentBy.charAt(0)}</AvatarFallback>
                   </Avatar>
        <p className="px-5 py-4 w-full h-auto text-wrap overflow-hidden" id={`${ele.messageId}`}>{ele.content}</p><div className={` z-20 options_${index} top-0 right-0 hidden transition-all duration-300 absolute bg-white px-5 shadow-md py-3 rounded-xl  gap-3 border border-solid border-gray-200`} >
                   <span className="inline-block my-auto cursor-pointer" onClick={()=>{edit(ele.messageId)}}> <EditIcon width={17} height={17} color="text-gray-900"/></span>
                    <span className="inline-block my-auto cursor-pointer" onClick={()=>{deleteMessage(ele.messageId)}}><DeleteIcon width={17} height={17} bg="text-red-500"/></span>
                  </div> 
        </div></>):(<> 
        <div className="flex  w-full bg-white  text-gray-800 shadow-md rounded-xl overflow-hidden" onMouseEnter={()=>{checkMouse()}} onMouseLeave={()=>{leaveMouse()}}>
        <Avatar className="my-auto mx-2 object-cover">
                    <AvatarImage className="object-cover" src={profile}/>
                    <AvatarFallback className="text-black">{ele.sentBy.charAt(0)}</AvatarFallback>
                   </Avatar>
        <p className="px-2 py-4 w-full h-auto text-wrap overflow-hidden relative" id={`${ele.messageId}`}>{ele.content}</p>
         
        </div>
        </>)}
    </>):(<>
    {fileContainer(ele.image.type,ele,pdfSrc,setPdfSrc,isZoom,setIsZoom)}
{/* hel {ele.image.type} */}
    </>)}
  </>
    )
  
}

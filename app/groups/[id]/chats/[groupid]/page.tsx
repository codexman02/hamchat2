"use client"

import ImageIcon from "@/app/snippets/imageIcon";
import SendIcon from "@/app/snippets/sendIcon";
import SmileIcon from "@/app/snippets/smileIcon";
import StopIcon from "@/app/snippets/stopIcon";
import { v4 as uuidv4 } from 'uuid';
import { deleteGroupMessage, editGroupMessage, getGroupChat, getUser, getUserGroup, GroupRequest, sendMessageGroup } from "@/app/utils/crud/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import MessageComponent from "@/app/component/Message";
import LeftArrow from "@/app/snippets/LeftArrow";
type message={
  contentType:null | string,
  content:string,
  image:null | string,
  messageId:string,
  seenBy:string[],
  sentBy:string,
  sentAt:string,
  profile:String
}[]
export default function Page(){

    let params=useParams();
    let user_id=params.id;
    let groupid=params.groupid;
    console.log(groupid,"groupid");
   let [messages,setMessages]=useState<message | []>([]);
   let [isMessage,setIsMessage]=useState(false);
   let messageInput=useRef<HTMLInputElement | null>(null);
   let [user,setUser]=useState<{_id:string,email:string,username:string,profile:string} | null>(null)
   let [modal,setModal]=useState(false);
   let [deleteModal,setDeleteModal]=useState(false);
   let [editId,setEditId]=useState("");
   let [deleteId,setDeleteId]=useState("");
   let [isAccepted,setIsAccepted]=useState<boolean | null>(null);
  let  [openChat,setOpenChat]=useState(false);



// //////////////////FUNCTIONS STARTS HERE
    async function getChats(){
      let getuser=await getUserGroup(user_id as string);
      if(getuser){
        let a=JSON.parse(getuser);
        console.log(a,"user")
        setUser(a)
      }
        let data=await getGroupChat(groupid as string);
        let res=await JSON.parse(data);
        console.log(res,"chat of group");
        res.members.forEach((ele:{user_id:string,hasAccepted:boolean})=>{
          if(ele.user_id==user_id as string){
            if(ele.hasAccepted==true){
              setIsAccepted(true)
              setOpenChat(true)
            }else{
              setIsAccepted(false)
              setOpenChat(true)
            }
          }
        })
        if(res.messages){
            setMessages(res.messages);
            setIsMessage(true);
        }
    }
    useEffect(()=>{
        getChats();
    },[]);
///////////////////////////////////////////
async function sendMessage(data:FormData){
    let message=data.get("message");
    let obj={
        contentType:null,
        content:message as string,
        messageId:uuidv4(),
        image:null,
        sentBy:user!.email,
        sentAt:new Date(Date.now()).toLocaleString(),
        seenBy:[user!.username?user!.username:user!.email],
        profile:user?.profile
    }
    console.log(message);
   let res= await sendMessageGroup(obj,groupid as string);
   console.log(res,"message saved")
  // console.log(user?.profile)
}

// console.log(user,"kkkkkkkkkk")
function openModal(id:string,type:"edit" | "delete"){
setModal(true)
if(type=="delete"){
  setDeleteId(id);
  setDeleteModal(true);
}else{
  setEditId(id);
}
}
///////////////////////////
function closeDeleteModal(){
  setDeleteModal(false);
  setModal(false);
}
//////////////////
async function deleteMessage(){
let res=await deleteGroupMessage(groupid as string,deleteId);
setModal(false);
setDeleteModal(false);
let a=document.getElementById(deleteId);
a!.style.display="none"
}
///////////////////////////////
async function editMessage(data:FormData){
  let message=data.get("message");
  // console.log(editId)
  let res=await editGroupMessage(groupid as string,editId,message as string);
  // console.log(message,editId)
}
console.log(isAccepted,"isAccepted")

async function handleRequest(){
let res=await GroupRequest(groupid as string,user_id as string);
setIsAccepted(true)

}

    return(
        <>
         <main className="w-full h-full max-h-full flex relative flex-col">
          {/* MODAL FOR EDIT AND DELETE STARTS HERE */}
          {modal &&  <div className="absolute w-full h-full bg-black bg-opacity-70 z-30 " >
     
     {deleteModal?(<>
     <div className="h-3/4 flex items-center justify-center">
       <div className="bg-white p-4 rounded-md">
         <p className="w-full text-gray-800">Do you want to delete your selected message?</p>
         <div className="w-full flex my-2">
           <button className="px-3 py-2 bg-gray-900 mx-2 text-white rounded-md text-sm font-light" onClick={()=>{deleteMessage()}}>Yes</button><button className="px-3 py-2 bg-red-600 mx-2 text-white rounded-md text-sm font-light" onClick={()=>{closeDeleteModal()}}>No</button>
         </div>
       </div>
     </div>
     </>):(<>
       <span className="back_arrow my-2 mx-3 inline-block cursor-pointer " onClick={()=>{setModal(false)}}><LeftArrow width={25} height={25} color="text-white"/></span>
     <form action={editMessage} className="flex gap-2 px-5 justify-center items-center h-3/5 relative z-30">
       <Input className="w-full" placeholder="Enter message..." name="message"/>
       <Button>Edit Message</Button>
     </form></>)}
    </div>
    
    }
          {/* MODAL FOR EDIT AND DELETE ENDS HERE */}
         <div className="w-full h-full bg-gray-50 flex flex-col overflow-y-scroll scroll-smooth">
       
       {isMessage ? (
         messages?.length!>0 ? (
           messages.map((ele, i: number) => (
             <div className="w-full" key={i} id={ele.messageId}> 
               {ele.sentBy == user!.email ? (
                 <div className="w-full p-3 relative flex justify-end" key={i}>
                 
                    <span className="flex w-1/2">
                    <MessageComponent ele={ele} same={true} index={i} modal={openModal} profile={user?.profile}/>
                    </span>
                 <div className="flex justify-center items-center cursor-pointer"   
                  >
                    
                    </div>
                 </div>
               ) : (
                 <div
                   className="w-full p-3 relative flex justify-start"
                   key={i}
                 >
                  
                   <span className="flex flex-col w-1/2" >
                   <MessageComponent ele={ele} same={false} index={i} modal={openModal} />
                   <p className="text-xs flex justify-end px-2 font-light italic text-gray-500">{ele.sentBy.split("@")[0]}</p>
                   </span>
                  
                 </div>
               )}
             </div>
           ))
         ) : (
           <>NO message page</>
         )
       ) : (
         <>
           <div className="flex flex-col w-full h-full justify-center items-center">
             {/* <Progress value={progress} className="w-1/2 h-2" /> */}
             <p className="w-1/2 text-sm my-1 text-center">
               Loading messages...
             </p>
           </div>
         </>
       )}
       <div className="bottom_scroll scroll-smooth"
        // ref={scroller}
        ></div>
     </div>
     {/* MESSAGE DISPLAY ENDS HERE */}


            {/* MESSAGE INPUT STARTS HERE */}
        {openChat?(<>
          {isAccepted?(<>
         {isAccepted==true?(<>
          <div className="message_input px-2 flex gap-4 py-2 bg-white border-t shadow-lg border-solid border-t-gray-200 relative z-20">
          <div className="cursor-pointer">
            <form action="" id="form">
              <input
                type="file"
                multiple
                className="hidden"
                // ref={file}
                accept=".pdf, image/*, video/*"
                // onChange={(e) => setImages(e.target.files)}
              />
              <button type="submit">Send File1</button>
            </form>
            <div
              onClick={() => {
                // file.current?.click();
              }}
            >
              <ImageIcon width={14} height={14} />
            </div>
          </div>
          <form action={sendMessage} className="w-full flex gap-2">
            <div className="w-full flex flex-col">
              <div>
                <Input
                  placeholder="type your message here..."
                  name="message"
                  ref={messageInput}
                />
              </div>
              <div className="icons flex justify-start py-2 gap-3">
               {/* <span className="inline-block" onClick={()=>openEmojiModal()}> */}
               <SmileIcon width={30} height={30} />
               {/* </span> */}
               <span className="inline-block cursor-pointer mx-2"
                // onClick={()=>sendAudio()}
                >
               {/* {isRecording?(<><StopIcon width={30} height={30}/></>):(<MicIcon width={30} height={30}/>)} */}
               </span>
               <span className="inline-block" 
            //    onClick={()=>stopRecording()}
               >Stop</span>
              </div>
            </div>
            <Button >
              <SendIcon width={15} height={15} />
            </Button>
          </form>
        </div>
         </>):(<></>)}
         
         </>):(<>
         <div className="w-full p-2 bg-gray-900">
           <p className="px-4 py-3 text-white text-lg">you were requested to join this group</p>
           <div className="flex px-4 py-2 gap-4">
            <button className="bg-green-700 text-white px-4 py-2 rounded-md" onClick={()=>{handleRequest()}}>Join Now</button>
            {/* <button className="bg-red-700 text-white px-4 py-2 rounded-md" onClick={()=>{handleRequest("reject")}}>Reject</button> */}
           </div>
         </div>
         </>)}
        </>):(<></>)}
         </main>
        </>
    )
}
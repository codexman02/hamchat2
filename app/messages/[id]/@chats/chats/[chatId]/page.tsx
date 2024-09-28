"use client";
import {
  createMessageDocument,
  editMessage,
  getChat,
  getUserAndReciever,
  saveAudio,
  saveImage,
  submitNewMessages,
} from "@/app/utils/crud/functions";
// import Picker from "emoji-picker-react"
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import ImageIcon from "@/app/snippets/imageIcon";
import SendIcon from "@/app/snippets/sendIcon";
import { userType } from "@/app/types/userType";
import { useToast } from "@/components/ui/use-toast";
import MessageComponent from "@/app/component/Message";
import { socket } from "@/app/socket";
import SmileIcon from "@/app/snippets/smileIcon";
import dynamic from "next/dynamic";
import MicIcon from "@/app/snippets/micIcon";
import StopIcon from "@/app/snippets/stopIcon";
import { record } from "zod";
import VerticalDots from "@/app/snippets/verticalDots";
import EditIcon from "@/app/snippets/EditIcon";
import DeleteIcon from "@/app/snippets/deleteIcon";
import LeftArrow from "@/app/snippets/LeftArrow";
export default function Chats() {
  let [refresh,setRefresh]=useState(false)
  useEffect(()=>{
// console.log("refreshdwe")
  },[refresh])
  const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
  let emoji = useRef<HTMLDivElement | null>(null);
  let [showChat,setShowChat]=useState(false);
  let [showRequest,setShowRequest]=useState(false);
  let [data1, setData] = useState<any>(null);
  let file = useRef<HTMLInputElement | null>(null);
  let params = useParams();
  let [isFetchs, setIsFetchs] = useState(false);
  let nameArr = [params.id as string, params.chatId as string].sort();
  let socketEventNameFile = (("_files" + nameArr[0]) as string) + nameArr[1];
  let socketEventNameMessage=("_messages"+nameArr[0] as string + nameArr[1]);
  let socketContact="_contacts"+params.id as string;
  let socketEditMessage="_updateMessage"+nameArr[0] as string+nameArr[1] as string;
  // console.log(socketEventName,"sokcetname")
  function socketTest(data: any) {
    // console.log(data, "testing");
  }
  async function updatedMessage(data:{id:string,message:string}[]){
    let id=data[0].id;
    let content=data[0].message;
    let ele=document.getElementById(id);
    if(ele){
      ele.innerText=content
    }
// console.log(data);
  }
  async function bhalu(data: any) {
    // console.log(data, "bhaku");
    setData((prev: any) => {
      return [...prev, data[0]];
    });
    // console.log(data, "from server");
    scrolling();
  }
  useEffect(()=>{
    scrolling();
  },[data1])
  async function arrangeMessage(data:any){
    console.log(data,"kiki")
    setData((prev:any)=>{
      return [...prev,data[0]]
    })
    // console.log(data,"message data1")
    scrolling();
  }
  useEffect(() => {
    socket.on(socketEditMessage,updatedMessage);
    socket.on(socketEventNameMessage,arrangeMessage);
    socket.on(socketEventNameFile, bhalu);
    return () => {
      socket.off(socketEventNameFile, bhalu);
      socket.off(socketEventNameMessage,arrangeMessage);
      socket.off(socketEditMessage,updatedMessage);
    };
  }, []);

  let [user, setUser] = useState<userType>({
    id: "",
    email: "",
    username: "",
    name: "",
    isVerified: false,
    profile:""
  });
  let [isFetch, setIsFetch] = useState(false);
  let [progress, setProgress] = useState(20);
  let router=useRouter();
  let [isMessage, setIsMessage] = useState(false);
  let [isFormData, setIsFormData] = useState(false);
  const [recieverData,setRecieverData]=useState<userType | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
let [request,setRequest]=useState<[{requestedBy:string,rejectedBy:string,rejected:boolean,requestTo:string}] | []>([])
  async function chats() {
    setProgress(70);
    let chat = await getChat([params.id as string, params.chatId as string]);
    // console.log(chat)
    setProgress(90);
    let user = await getUserAndReciever({user_id:params.id as string,reciever_id:params.chatId as string});
     console.log(user.data[1],'use')
    setUser(user.data[0]); //SETTING THE CURRENT USER
    setRecieverData(user.data[1])
    let response;
    if(chat.data){
       response = await JSON.parse(chat.data);
    }else if(chat.request){
      response=[]
setRequest(JSON.parse(chat.request))
// console.log(JSON.parse(chat.request),"request")
setShowRequest(true)
    }
    else{

router.push(`/messages/${params.id}`)
response=[]
    }
    // console.log(response, "resposne");
    if(response.length>0 && chat.data){
      setData(response[0].messages);
      // console.log(response[0].messages,"heleocjini ehb bhub");
      // setData(response[0].messages.splice(0, 10));
      setShowChat(true)
      scrolling();
    }else{
      setData(null)
    }
    // setData(response[0].messages);
    
    setProgress(90);
    setIsMessage(true);
    // return response[0].messages;
  }
  useEffect(() => {
    chats();
  }, []);

  //////////////
  let form = useRef<HTMLFormElement | null>(null);
  ////////////////////
  let { toast } = useToast();
  async function handleSend(e: FormData) {
    let message = e.get("message") as string;
    // console.log(message);

    setIsFetch(true);
    if (message!.length == 0) {
      toast({
        title: "Please write something in the message field",
        variant: "destructive",
      });
      return;
    }
    // console.log(newMessage.length);
    let data = {
      messageId:uuidv4(),
      content: message as string,
      sentBy: user?.email,
      sentAt: new Date(Date.now()).toLocaleString(),
      seenBy: [user?.email],
    };
await socket.emit(socketEventNameMessage,data)
let contactData:{contact_id:string,username:string,lastMessage:{content:string,sentAt:Date},numberOfNewMessages:number,profile?:string}={
  contact_id:params.chatId as string,
  username:user.username,
  lastMessage:{
    content:message as string,
    sentAt:new Date(Date.now())
  },
  profile:user.profile,
  numberOfNewMessages:1
}
await socket.emit(socketContact,contactData);
let sender=params.id as string;
let reciever=params.chatId as string;
    let users = [params.id, params.chatId];
    let res = await submitNewMessages(data, users as string[],sender,reciever);
    // console.log(newMessage)
    // console.log(res)
    scrolling();
    messageInput.current!.value=""
  }
  const formData = new FormData();
  let [images, setImages] = useState<FileList | [] | null>([]);
  /////////FUNCTION OF HANDLING FILE
  async function handleFile(e: FormData) {
    // console.log(images);
    if (images?.length == 0) {
      toast({
        title: "Please select an image first",
        variant: "destructive",
      });
      return;
    }
    let keyArr = [];
    for (let i = 0; i < images!.length; i++) {
      let newFormData = new FormData();
      newFormData.set("file", images![i]);
      let users = [params.id as string, params.chatId as string];
      let userData = { sentBy: user.email, seenBy: [user.email] };
      let returnData = await saveImage(newFormData, users, userData);
      // console.log(returnData);
      // socket.emit(socketEventName,returnData)
      socket.emit(socketEventNameFile, returnData);
    }

    socket.emit("haha", "hello server");
    //Empty the images again

    return () => {
      socket.disconnect();
    };
  }
  let messageInput = useRef<HTMLInputElement>(null);
  ////////////HANDLING FILE END HERE
  async function handleEmoji(obj:any) {
    let a = messageInput?.current?.value + obj.emoji;
    messageInput.current!.value = a;
 
    // console.log(a);
  }
function openEmojiModal(){
if(emoji.current?.classList.contains("-top-3/4")){
  emoji.current.classList.replace("-top-3/4","top-16")
}else{
  emoji.current?.classList.replace("top-16","-top-3/4")
}
}
// let stream:MediaStream;
// let recorder;
let [isRecording,setIsRecording]=useState(false);
let [audioSrc,setAudioSrc]=useState(null)
let stream:MediaStream;
let [recorder,setRecorder]=useState<MediaRecorder | null>(null)
// let recorder:MediaRecorder;
async function getPermission(){
  stream=await navigator.mediaDevices.getUserMedia({
    audio:true
  });
  if(stream.active){
    recorder=new MediaRecorder(stream)
    
    // console.log("this is recorder", recorder)
    return recorder

  }
}

let chunks:any=[];
async function sendAudio(){
  chunks=[]
  let a =await getPermission();
  if(recorder){
    
    recorder.ondataavailable=(e)=>{
      chunks.push(e.data)
      // console.log(e)
      }
      recorder.onstop=async ()=>{
        let audioForm=new FormData();
        
      
        // console.log("data ruk gya")
        let blob=new Blob(chunks,{type:"audio/wav"})
        let url=await URL.createObjectURL(blob)
        await audioForm.set("audio",blob)
        let p= await saveAudio(audioForm,user)
      chunks=[]
     
      let newAudio=p
      setData((prev:any[])=>{
        return [...prev,newAudio]
      })
      }
      recorder.start()
      
        setIsRecording(true)
       setRecorder(recorder)
      // console.log(recorder.state)
     scrolling();
    return recorder
  }else{
    return
  }
    
    

}
async function stopRecording(){
recorder!.stop()
}
async function testing(){
 await createMessageDocument({type:"accepted",ids:nameArr,user:user.username})
 setShowChat(true);
 setShowRequest(false);
 setData([]);
}

async function testing1(){
  let a=await createMessageDocument({type:"rejected",ids:nameArr,rejectedBy:user.username});
  // setRefresh(a)

  if(a){
    // console.log("kkk")
window.location.reload()
  }
  // console.log(a,"aaa")
}
let scroller=useRef<HTMLDivElement | null>(null);
function scrolling(){
  scroller.current?.scrollIntoView();
}
let optionTimeout;
let [inDots,setInDots]=useState(false);
let [inOptions,setInOptions]=useState(false);

let cheeku:boolean;
let [showingOptions,setIsShowingOptions]=useState(false);

async function handleEdit(data:FormData){
  let message=data.get("message") as string;
setModal(false);
let result=await editMessage(editId,message);
if(result){
  socket.emit(socketEditMessage,{id:editId,message:message});
  // console.log("emitted");
}
  // console.log(data.get("message"),editId)
}
let [modal,setModal]=useState(false);
let [editId,setEditId]=useState("");
let [deleteId,setDeleteId]=useState("");
let [deleteModal,setDeleteModal]=useState(false);
function openModal(id:string,type:("edit" | "delete")){
  setModal(true)
if(type=="edit"){
  setEditId(id);
  // console.log(id,"modal opened")
}else if(type=="delete"){
  setDeleteId(id);
  setDeleteModal(true)
}
}
function closeDeleteModal(){
  setDeleteId("");
  setDeleteModal(false);
  setModal(false)
}
async function deleteMessage(){
  console.log("message Deleted");
  setDeleteModal(false);
  setModal(false);
  // console.log("hehe")
}
  return (
    <>
   {/* <div className="w-full h-auto"> */}
  {/* //   <audio controls><source src="http://localhost:3000/chatImages/65a1f263-f551-41df-aaad-6c44e77e0d8brecorded_File.wav" /></audio>
  //  hello
  //   </div> */}
      <main className="w-full h-full max-h-full flex relative flex-col">
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
      <form action={handleEdit} className="flex gap-2 px-5 justify-center items-center h-3/5 relative z-30">
        <Input className="w-full" placeholder="Enter message..." name="message"/>
        <Button>Edit Message</Button>
      </form></>)}
     </div>
     
     }
      <div id="choco">
     
      </div>

       {showChat &&  <div className="w-full h-full bg-gray-50 flex flex-col overflow-y-scroll scroll-smooth">
       
       {isMessage ? (
         data1 ? (
           data1.map((ele: any, i: number) => (
             <div className="w-full" key={i}> 
               {ele.sentBy == user.email ? (
                 <div className="w-full p-3 relative flex justify-end" key={i}>
                  {/* <div className={`absolute options_${i} top-4 right-7 transition-all duration-300 hidden bg-white px-5 shadow-md py-2 rounded-xl  gap-3 border border-solid border-gray-200`} onMouseEnter={()=>{pekka(true)}} onMouseLeave={()=>{pekka(false,`options_${i}`)}} >
                    <EditIcon width={17} height={17} color="text-gray-900"/>
                    <DeleteIcon width={17} height={17} bg="text-red-500"/>
                  </div> */}
                    <span className="inline-block w-1/2"  ><MessageComponent ele={ele} same={true} profile={user.profile} index={i} modal={openModal}/></span>
                 <div className="flex justify-center items-center cursor-pointer"   
                  ><VerticalDots height={20} width={20} color="text-gray-700"/></div>
                 </div>
               ) : (
                 <div
                   className="w-full p-3 relative flex justify-start"
                   key={i}
                 >
                   <span className="inline-block w-1/2"  >
                   <MessageComponent ele={ele} same={false} profile={recieverData?.profile} index={i} modal={openModal}/>
                   </span>
                   
                   {/* <div className="flex justify-center items-center cursor-pointer relative" 
                 ><VerticalDots height={20} width={20} color="text-gray-700"/>
                </div> */}
                 </div>
               )}
             </div>
           ))
         ) : (
           <>NO message</>
         )
       ) : (
         <>
           <div className="flex flex-col w-full h-full justify-center items-center">
             <Progress value={progress} className="w-1/2 h-2" />
             <p className="w-1/2 text-sm my-1 text-center">
               Loading messages...
             </p>
           </div>
         </>
       )}
       <div className="bottom_scroll scroll-smooth" ref={scroller}></div>
     </div>
       
       }
        <div
          className="absolute mx-auto left-1/2 -top-3/4 w-auto h-auto z-0 transition-all duration-300 ease-in"
          ref={emoji}
        >
          {/* <Picker lazyLoadEmojis={true} onEmojiClick={handleEmoji} /> */}
          <>t</>
        </div>

        {data1 && <div className="message_input px-2 flex gap-4 py-2 bg-white border-t shadow-lg border-solid border-t-gray-200 relative z-20">
          <div className="cursor-pointer">
            <form action={handleFile} ref={form} id="form">
              <input
                type="file"
                multiple
                className="hidden"
                ref={file}
                accept=".pdf, image/*, video/*"
                onChange={(e) => setImages(e.target.files)}
              />
              <button type="submit">Send File1</button>
            </form>
            <div
              onClick={() => {
                file.current?.click();
              }}
            >
              <ImageIcon width={14} height={14} />
            </div>
          </div>
          <form action={handleSend} className="w-full flex gap-2">
            <div className="w-full flex flex-col">
              <div>
                <Input
                  placeholder="type your message here..."
                  name="message"
                  ref={messageInput}
                />
              </div>
              <div className="icons flex justify-start py-2 gap-3">
               <span className="inline-block" onClick={()=>openEmojiModal()}>
               <SmileIcon width={30} height={30} />
               </span>
               <span className="inline-block cursor-pointer mx-2" onClick={()=>sendAudio()}>
               {isRecording?(<><StopIcon width={30} height={30}/></>):(<MicIcon width={30} height={30}/>)}
               </span>
               <span className="inline-block" onClick={()=>stopRecording()}>Stop</span>
              </div>
            </div>
            <Button>
              <SendIcon width={15} height={15} />
            </Button>
          </form>
        </div>
        
        }
        {request.length>0?(<>
         {showRequest &&  <div className="w-full h-full">
         {user.username==request[0]?.requestedBy?(<>
         <div className="w-full h-full p-10 content-center">
            {request[0].rejected?(<>
            <div className="flex flex-col justify-center px-5">
            <p className=" text-xl text-gray-800 font-medium my-2">Unfortunately this convo was rejected by {request[0].rejectedBy}</p>
            <Button className="w-min" onClick={()=>{createMessageDocument({type:"again",ids:nameArr,requestedBy:user.username,user:user.username})}}>Request Again</Button>
            </div>
            </>):(<p className="text-center">Waiting for {request[0].requestTo} to start this conversation...</p>)}
         </div>
         </>):(<>
         <div className="w-full h-full p-10 flex justify-center items-center">
             {request[0]?.rejected?(<>
             <div className="text-red-500 font-medium text-xl flex flex-col"><p className="text-2xl my-3">You have rejected this conversation...</p>
             <Button className="w-min" onClick={()=>{createMessageDocument({type:"again",ids:nameArr,requestedBy:user.username,user:user.username})}}>Request Again</Button>
             </div>
             </>):(<>
              <div className="px-7 py-6 border border-solid border-gray-200 rounded-md shadow-sm">
<p className="my-3 text-lg font-medium text-gray-800">Do you want to start conversation with {request[0]?.requestedBy}?</p>
<button className="bg-red-500  px-4 py-2 text-white font-medium rounded-lg mr-2" onClick={()=>{testing1()}}>No</button><button className="bg-gray-800 mx-2 text-white font-medium px-4 py-2 rounded-lg" onClick={()=>{testing()} }>Yes</button>
             </div>
             </>)}
         </div>
         </>)}
        </div>}
        </>):(<>
       
        </>)}
      </main>
    </>
  );
}

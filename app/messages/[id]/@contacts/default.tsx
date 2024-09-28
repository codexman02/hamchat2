"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createContact, deleteContacts, getMessages } from "@/app/utils/crud/functions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { time } from "console";
import { getSession, useSession } from "next-auth/react";
import { socket } from "@/app/socket";
import DeleteIcon from "@/app/snippets/deleteIcon";
import RefreshIcon from "@/app/snippets/refresh";
type MessagesType={
user_id:string,
list:any[] | null,
messages: null,
blockList:string[] | null,
groups:string[] | null
}
type UserData={
    contact_id:string,email:string,lastMessage:{content:string,sentAt:Date,numberOfNewMessgaes:number},name:string,username:string
}[] 
export default function ContactsPage(){
    const session1=useSession();
    const [checkAgain,setCheckAgain]=useState(false)
    function checkUserId(){
        setTimeout(()=>{
            if(session1.status=="loading"){
                setCheckAgain(!checkAgain)
            }else if(session1.status=="authenticated"){
                if(session1.data){
                    if(id!==session1.data?.user._id){
                        router.push("/")
                    }else if(!session1.data.user.isVerified){
                        router.push(`/profile/${session1!.data.user._id}`)
                    }else{
                        setIsUser(true);
                    }
                }
            }else{
                router.push("/")
            }
           
        },800)
       }
useEffect(()=>{ 
    checkUserId()
},[checkAgain]);
    let [isUser,setIsUser]=useState(false);
   let [messages,setMessages]=useState<any | null>(null);
   let [user,setUser]=useState<{_id:string,username:string,lastMessage:{content:string,sentAt:Date},name:string,email:string,contactList:any[],profile?:string}>({
    _id:"",username:"",lastMessage:{content:"",sentAt:new Date(Date.now())},name:"",email:"",contactList:[{}]
   });
   let [data,setData]=useState<any | null>(null)
    const params=useParams();
    let id=params.id as string;
    let chatId=params.chatId as string;
    // console.log(chatId,"this is chat id")
    let socketName="_contacts"+id;
    async function setSocketContacts(data:{contact_id:string,username?:string,email?:string,name?:string,lastMessage:{content:string,sentAt:Date},numberOfNewMessages:number}[]){
       setData((prev:any[])=>{
        let arr:any[]=[]
        prev.forEach((ele)=>{
 if(ele.contact_id==data[0].contact_id){
    data[0].username=ele.username;
    data[0].email=ele.email;
    data[0].name=ele.name;
    arr.push(data[0])
 }else{
    arr.push(ele)
 }
        })
        // console.log(arr,"arr of contacts")
     let u=arr.sort((a,b)=>{
        let first:any=new Date(a.lastMessage.sentAt) 
        let second:any=new Date(b.lastMessage.sentAt) 
        return second as number-first as number;
     });   
return [...u]
       })
    //  console.log(socketName,data,"data by contacts")
    }
    useEffect(()=>{
        socket.on(socketName,setSocketContacts);
        return ()=>{
            socket.off(socketName,setSocketContacts)
        }
    },[]);
let router=useRouter();
    async function test(){
         let y=await getMessages(id)
        if(y){
            let contacts:UserData=JSON.parse(y[0].userData);
            let sortedContacts=contacts.sort((a,b)=>{
                let first:any=new Date(a.lastMessage.sentAt);
                let second:any=new Date(b.lastMessage.sentAt) ;
              
                return second-first
                
            })
            // console.log(sortedContacts,"sorted aray")
            
            setData(sortedContacts);
            setUser(JSON.parse(y[0].i));
        }
    }
    useEffect(()=>{
    
        test()
        
        
    },[])

    let [term,setTerm]=useState("")
    let [searchedUsers,setSearchedUses]=useState<{username:string,_id:string,added?:true}[] | []>([]);
    let [searching,setSeaching]=useState(false)
let [timeout,settimeout]=useState<any>()
function handleSearch(text:string){
    
setTerm(text)

clearTimeout(timeout);
settimeout(setTimeout(async ()=>{
    let list=await fetch(`/api/getUser?username=${text}`)
    let res:{username:string,_id:string,added?:true}[]=await list.json()
    // console.log(res)
    if(res.length>0){
        let res2=await res.filter(ele=>ele._id!=user._id)
        // console.log(res2,"res2")
        res2.forEach((ele)=>{
            // console.log(user,"user")
            user.contactList.forEach((el)=>{
                if(el.contact_id==ele._id){
                    ele.added=true
                    // console.log("hai added")
                }
            })
        })
        // console.log(res2)
        setSearchedUses(res2)
    }else{
        setSearchedUses([])
    }
 
},1500))
}

async function create({username2,id1,username1}:{username2:string,id1:string,username1:string}){
   if(user){
    await  createContact({id1,username1,username2})
    await test();
    // console.log(username2,username1,id1)
   }
}

// console.log(user)
async function delete_contact(user_id:string,contact_id:string){
    let a=await deleteContacts(user_id,contact_id);
    // console.log(a)
    // console.log(contact_id,user_id,"deleted")
    await test()   //to refresh contacts
}
    return(
<div className="flex w-full h-full ">
{isUser && <div className="lists w-full flex flex-col border-solid border-r  h-full ">
<h1 className="text-gray-800 font-semibold text-3xl px-3 py-5">Messages</h1>
<hr className="mt-1" />
<div className="w-full flex flex-col gap-4 px-5 py-3 relative">
        <div className="flex gap-4">
        <Input placeholder="search users"  name="search" onChange={(e)=>{handleSearch(e.target.value)}} onFocus={()=>setSeaching(true)} onBlur={()=>setSeaching(false)}/>
        <Button onClick={()=>{test()}}><RefreshIcon width={20} height={20} bg="text-white"/></Button>
        </div>
         {searchedUsers.length>0?(<>
            <div className="absolute top-10 mt-8 z-50 left-0 w-full  bg-white shadow-md rounded-md h-96 overflow-y-scroll ">
            <hr/>
            {/* {searchedUsers.length>0?(<> */}
            {searchedUsers.map(ele=>(
               <div  key={ele.username}>
                <div className="p-5 flex justify-center items-center "> 
                   <Avatar>
                    <AvatarImage src=""/>
                    <AvatarFallback>{ele.username.charAt(0)}</AvatarFallback>
                   </Avatar>
                    <p className="grow px-5 font-medium text-xl">{ele.username}</p>
                    {ele.added?(<Button disabled>Added</Button>):(
                        <Button onClick={()=>create({username2:ele.username,id1:user._id as string,username1:user.username})}>Add</Button>
                    )}
                </div>
                <hr/>
               </div>
            ))}
            {/* </>):(<>{searching?(<p className="p-10">Search Users</p>):(<></>)}</>)} */}
          </div>
         </>):(<> 
           </>)}
        </div>
{data?(<></>):(<>
<div className="no_friends">
    <h2>You have no contacts</h2>
</div>
</>)}
{data?( 
<div className="contacts_box overflow-y-auto">
{data.length>0? (data.map((ele:any,i:number)=>( 
    <div key={i}> 
     {/* <Link href={`/messages/${id}/chats/${ele.contact_id}`} key={ele.username} className="relative z-10"> */}
    {ele.contact_id==chatId?(
        <>
         <div className="list-items px-3 py-5 flex relative bg-gray-200" key={ele.username}>
             <Link href={`/messages/${id}/chats/${ele.contact_id}`}  className="relative z-10 flex w-11/12">
         <Avatar>
           <AvatarImage src={ele.profile} />
           <AvatarFallback>{ele.username?ele.username.charAt(0):ele.email.charAt(0)}</AvatarFallback>
         </Avatar>
         <div className="flex flex-col w-full overflow-hidden text-nowrap text-ellipsis ml-5 grow">
             <h2 className="text-lg font-semibold">{ele.username}</h2>
         <p className="w-full py-1 content-center text-base overflow-x-hidden text-nowrap text-ellipsis">{ele?.lastMessage.content}</p>
         </div>
         </Link>
         <div className="time absolute top-0 right-0 px-2 py-2 text-sm font-light text-gray-700">{ele.lastMessage.sentAt.toLocaleString()}</div>
         <div className="delete flex justify-center items-center w-full">
            {chatId?(<></>):(<span className="inline-block relative cursor-pointer" onClick={()=>{delete_contact(id,ele.contact_id)}}><DeleteIcon width={20} height={20} bg="text-red-600" /></span>)}
         </div>
         </div>
        </>
    ):(
        <div className="list-items px-3 py-5 flex relative bg-white" key={ele.username}>
             <Link href={`/messages/${id}/chats/${ele.contact_id}`} key={ele.username} className="relative z-10 flex w-full">
        <Avatar>
          <AvatarImage src={ele.profile} />
          <AvatarFallback>{ele.username?ele.username.charAt(0):ele.email.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full overflow-hidden text-nowrap text-ellipsis ml-5">
            <h2 className="text-lg font-semibold">{ele.username}</h2>
        <p className="w-full py-1 content-center text-base overflow-x-hidden text-nowrap text-ellipsis">{ele?.lastMessage.content}</p>
        </div>
        </Link>
        <div className="time absolute top-0 right-0 px-2 py-2 text-sm font-light text-gray-700">{ele.lastMessage.sentAt.toLocaleString()}</div>
        <div className="delete flex justify-center items-center">
            {chatId?(<></>):(<span className="inline-block relative z-20 cursor-pointer" onClick={()=>{delete_contact(id,ele.contact_id)}}><DeleteIcon width={20} height={20} bg="text-red-600" /></span>)}
        </div>
        </div>
    )}
    {/*  </Link> */}
    </div>

 )
 )):(<>
 <div className="p-5 text-center text-gray-700">You have no contacts</div>
 </>)}
</div>
):(<div>loading you contacts please wait...</div>)}

<hr />
</div>}

</div>
    )
}
"use client"

import DeleteIcon from "@/app/snippets/deleteIcon";
import LeftArrow from "@/app/snippets/LeftArrow";
import { addGroupMember, deleteMember, getGroupInfo } from "@/app/utils/crud/functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";

export default function Page(){
let params=useParams();
let user_id=params.id;
let group_id=params.groupid;
let [group,setGroup]=useState<{groupName:string,admin:string[]} | null>(null);
let [members,setMembers]=useState<{user_id:string,email:string,username:string,isAdmin:boolean,hasAccepted:boolean,profile?:string}[] | []>([]);
let modal=useRef<HTMLDialogElement | null>(null);
let [searchTimeout,setSearchTimeout]=useState<any | null>(null);
let [searchText,setSearchText]=useState("");
let [searchedUsers,setSearchedUsers]=useState<{_id:string,username:string,email:string}[] | [] >([]);




async function getGroup(){
    let res:(string | {status:boolean,message:string})=await getGroupInfo(group_id as string) as string;
    let data=await JSON.parse(res);
    setGroup(data);
    setMembers(data.members);
    console.log(data.members,"data of group")
}
useEffect(()=>{
    getGroup()
},[])
// console.log(user_id,group_id,"settngs")
//////////////////////
function openModal(){
    modal.current?.showModal();
}
////////////////////
function closeModal(){
    // document.getElementById("add_user_modal").close()
    console.log("clicked")
    modal.current?.close();
}

////////////////////
async function handleSearch(text:string){
setSearchText(text);
clearTimeout(searchTimeout);
setSearchTimeout(setTimeout(async ()=>{
    let list=await fetch(`/api/getUser?username=${text.trim()}`);
    let data=await list.json();
    setSearchedUsers(data);
//     console.log(data);
// console.log(text);
},1500))
// console.log(text)
}
///////////////////
async function addMember(userid:string){
let res=await addGroupMember(group_id as string,userid,group?.groupName as string);
// console.log(res)
// console.log(userid,group_id);
}
// useEffect(()=>{
//     console.log(group,group.groupName,"grou data")
// },[group])
function check(){
    console.log(group?.admin)
}
async function removeMember(member_id:string){
    let res=await deleteMember(member_id,group_id as string);
    console.log(member_id,"  ",group_id)
}
    return(
        <>
        <main className="wrapper">
            {/* <button onClick={()=>check()}>Check</button> */}
            <dialog id="add_user_modal" className="p-2 w-2/5 h-full rounded-sm overflow-y-hidden" ref={modal}>
            <div className="flex justify-start items-center w-full">
                <span className="inline-block px-3 my-auto cursor-pointer" onClick={()=>{closeModal()}}>
                    <LeftArrow width={20} height={20} color="text-gray-800"/>
                </span>
            </div>
               <div className=" w-3/4 mx-auto py-3">
                <Input placeholder="search members..." className="font-light" onChange={(e)=>{handleSearch(e.target.value)}} />
               </div>
               <div className="searchedUsers flex flex-col mx-auto w-10/12 h-full py-2 overflow-y-auto">
                 
                 {searchedUsers.length>0?(<>
                    {searchedUsers.map((ele)=>(
                        <>
                       {ele._id==user_id?(<></>):(<>
                        <div className="item w-full flex   px-3 py-2">
                    <div className="flex w-full">
                    <Avatar>
                    <AvatarImage src=""/>
                    <AvatarFallback className="text-sm">{ele.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="grow text-center my-auto text-sm">{ele.username?ele.username:ele.email}</p>
                    </div>
                   <button className="text-xs px-3 py-0 bg-gray-900 text-white rounded-sm" onClick={()=>{addMember(ele._id)}}>Add</button>
                  </div> 
                       </>)}
                  <hr />
                        </>
                    ))}
                 </>):(<>
                 <p className="text-sm text-center font-light">search members...</p>
                 </>)}
               </div>
            </dialog>
            {/* DIALOG ENDS HERE */}
<div className="bg-gray-900 text-white px-4 py-3 text-center text-lg">{group?group.groupName:"Group"}</div>
<div className="text-base text-gray-900 px-4 py-2 flex ">
    {group?(
      <>
        {group.admin.includes(user_id as string)?(<><Button onClick={()=>{openModal()}}>Add</Button></>):(<></>)}
      </>
):(<></>)}
    <p className="grow text-center my-auto">Members</p>
</div>
<hr />
<div className="members_list">
    {members.map((ele,i)=>(
        <>
<div className="flex py-2 px-3 relative">
    <p className="flex justify-center items-center px-2">{i+1}</p>
<div className="flex items-center px-2 py-2 w-full relative">
                    <Avatar>
                    <AvatarImage className="object-cover" src={ele.profile}/>
                    <AvatarFallback>{ele.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                <p className="mx-3  text-gray-800 font-normal text-lg grow">{ele.username?ele.username:ele.email}</p>
               {group?.admin.includes(user_id as string)?( <div className="flex cursor-pointer">
                    {group?.admin.includes(ele.user_id)?(<></>):(<span className="inline-block" onClick={()=>{removeMember(ele.user_id)}}>{ele.user_id==user_id?(<>Leave</>):(<DeleteIcon width={20} height={20} bg="text-red-500"/>)}</span>)}
                </div>):(<>
                {ele.user_id==user_id?(<>
                <span className="text-red-600 text-sm font-medium cursor-pointer" onClick={()=>{removeMember(ele.user_id)}}>Leave</span>
                </>):(<></>)}
                </>)}
                </div>
                {group?(<>
                {ele.isAdmin?(<small className="italic absolute top-0 right-3">admin</small>):(<></>)}
                </>):(<></>)}
</div>
<hr />
        </>
    ))

    }
</div>
        </main>
        </>
    )
}
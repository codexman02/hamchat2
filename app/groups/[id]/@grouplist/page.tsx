"use client"
import DeleteIcon from "@/app/snippets/deleteIcon";
import SettingsIcon from "@/app/snippets/SettingsIcon";
import VerticalDots from "@/app/snippets/verticalDots";
import { getGroups } from "@/app/utils/crud/functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
type group={
    groupName:string,
    group_id:string,
    lastMessage:{content:string,sentAt:string},
    members:{user_id:string,hasAccepted:boolean}
}[]
export default function Page(){
    let [groups,setGroups]=useState<group | []>([]);
    let [isGroupId,setIsGroupId]=useState(false);
    let params=useParams();
    let user_id=params.id;
    console.log(params)
    let groupid=params.groupid;

    // if(groupid){
    //     setIsGroupId(true)
    // }
    // // console.log(user_id);

    function openModal(){
        const dialog:HTMLDialogElement=document.getElementById("create_group") as HTMLDialogElement;
        dialog.showModal();
        // console.log(dialog);
    }

async function getGroupData(){
    let data=await getGroups(user_id as string);
    let res:group=await JSON.parse(data);
    setGroups(res);
    console.log(groups)
}
useEffect(()=>{
    getGroupData()
},[])
// console.log(groups,"koo")
function openSettings(name:string){
let ele=document.querySelector(`.${name}`);
if(ele?.classList.contains("hidden")){
    ele.classList.remove("hidden");
    ele.classList.add("inline-block");
}else{
    ele!.classList.remove("inline-block");
    ele!.classList.add("hidden");
}

}
async function deleteGroup(){
    let ele:HTMLDialogElement=document.getElementById("delete_group") as HTMLDialogElement;
    ele.showModal()
}
    return(
        <>
        <div className="wrapper border-solid  h-full border-r border-r-gray-200">
        <h1 className="text-xl text-white font-light px-4 py-3 bg-gray-900 rounded">Groups</h1>
        <div className="create_group w-full flex justify-start p-5">
            <Button onClick={()=>{openModal()}}>create group</Button>
        </div>
        <hr />
        <div className="list">
            {/* <div className="w-full  py-3">
                <div className="flex items-center px-4">
                    <Avatar>
                    <AvatarImage src=""/>
                    <AvatarFallback>PF</AvatarFallback>
                    </Avatar>
                <p className="mx-3  text-gray-800 font-normal text-lg">Group Name</p>
                </div>
                <p className="lastMessage text-normal text-base my-2 px-4">This is last message</p>
                <hr />
            </div> */}
            {groups.length>0?(
                groups.map((ele,i)=>(
                    <>
                    <div className="w-full  py-3 flex relative" key={i}>
               <Link className="inline-block w-full px-4" href={`/groups/${user_id}/chats/${ele.group_id}`}>
               <div className="flex items-center px-4">
                    <Avatar>
                    <AvatarImage src=""/>
                    <AvatarFallback>{ele.groupName.charAt(0)}</AvatarFallback>
                    </Avatar>
                <p className="mx-3  text-gray-800 font-normal text-lg grow">{ele.groupName}</p>
                </div>
                <p className="lastMessage text-normal text-base my-2 px-4">{ele.lastMessage.content}</p>
               </Link> 
                
              {groupid?(<>
                <span className="flex justify-center items-center cursor-pointer" onClick={()=>{openSettings(`settings_${i}`)}}>
                <VerticalDots width={20} height={20} color="text-gray-800"/>
               </span>
               <span className={`flex rounded-md flex-col settings_${i} hidden absolute  right-4 top-2 bg-white border border-solid border-gray-200`} >
               <Link href={`/groups/${user_id}/chats/${ele.group_id}/settings`} className={` text-white font-light px-2 py-1 text-sm rounded`}>
               <SettingsIcon width={20} height={20} color="text-gray-900"/>
               </Link>
               <p className="text-center flex justify-center my-2" onClick={()=>{deleteGroup()}}><DeleteIcon width={20} height={20} bg="text-red-600"/></p>
               </span>
            

              </>):(<>
              </>)}
            </div>
            <hr />
                    </>
                ))
            ):(<>NO</>)

            }
        </div>
        </div>
        </>
    )
}
"use client";

import { Navbar } from "@/app/component/Navbar";
import LeftArrow from "@/app/snippets/LeftArrow";
import { createGroup } from "@/app/utils/crud/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";

export default function Layout({children,grouplist}:{children:React.ReactNode,grouplist:React.ReactNode}){
  
  let params=useParams();
  let user_id=params.id;
  // console.log(user_id,"from layout");
  const {toast}=useToast()
  function closeModal(){
    let dialog:HTMLDialogElement=document.getElementById("create_group") as HTMLDialogElement;
    dialog.close();
  }

  async function createG(data:FormData){
let user=[{user_id:user_id as string,hasAccepted:false}];
let id=user_id as string;
let groupname=data.get("groupname") as string;
if(groupname.length>0){
  let a=await createGroup(id,groupname,user);
}else{
  toast({
    title:"enter your group name",
    variant:"destructive"
  })
}
  }
    
return(
    <>
    <Navbar/>
   <div className="w-full min-h-[calc(100vh-70px)] max-h-max flex">
{/* DELETE DIALOG STARTS HERE */}
<dialog id="delete_group" className=" rounded-md shadow-md py-3">
   <div className="w-11/12 flex flex-col mx-auto py-2">
    <p className="px-4 py-2 mx-auto">do you really want to remove this group from your contacts?</p>
    <div className="flex px-3 gap-3">
      <button className="bg-green-600 text-white px-3 py-2 text-sm rounded-md">Yes</button>
      <button className="bg-red-600 text-white px-3 py-2 text-sm rounded-md" onClick={()=>{
        let ele:HTMLDialogElement=document.getElementById("delete_group") as HTMLDialogElement;
       ele.close()
      }}>No</button>

    </div>
   </div>

</dialog>
{/* DELETE DIALOG ENDS HERE */}

  <dialog id="create_group" className=" bg-white px-2 py-6 rounded-md z-10 shadow-md" >
    <div className="px-4 cursor-pointer" onClick={()=>{closeModal()}}><LeftArrow height={20} width={20} color="text-gray-800"/></div>
    <form action={createG} className="flex flex-col ">
     <div className="flex justify-center items-center px-4 py-2">
     <label htmlFor="groupname" className="text-sm w-1/3">Group Name</label>   
     <Input placeholder="enter group name..." id="groupname" className="w-2/3" name="groupname"/>
     </div>
     <div className="flex justify-center items-center px-4 py-2">
        {/* <label htmlFor="addMember" className="text-sm w-1/3">Add Members</label>
        <Input placeholder="search members..." className="w-2/3"/> */}
        <p className="text-sm font-light text-gray-700">Once you have created your group you <br /> can add members from group settings.</p>
     </div>
     <Button type="submit">Submit</Button>
    </form>
  </dialog>
   <div className="w-1/3">
  {grouplist}
   </div>
   <div className="w-2/3">{children}</div>
   
   </div>
    </>
)
}
"use client"
import { Navbar } from "@/app/component/Navbar";
import { changeProfile, checkUsername,  getUserAndReciever, updateUsername } from "@/app/utils/crud/functions";
import { dbConnect } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Image from "next/image"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export default function ProfilePage(){
    const [user,setUser]=useState<({id:string,name:string,username:string,email:string,profile?:string} | null)>(null)
    const [verified,setVerified]=useState(true);
    const detailsDialog=useRef<HTMLDialogElement | null>(null);
    const param=useParams();
    let id:(string | string[])=param.id;
    const [timer,setNewTimer]=useState<NodeJS.Timeout | null>(null);
    const [isUsernameAvailable,setIsUsernameAvailable]=useState<string>("");
    const [isSearching,setIsSearching]=useState(false);
    const [isUnique,setIsUnique]=useState(false);
    const profileForm=useRef<HTMLFormElement | null>(null);
    const imageSrc=useRef<HTMLImageElement | null>(null);
    const [progress,setProgress]=useState(0);//progress bar values
    const router=useRouter();
useEffect(()=>{
  dbConnect();
},[])
    ////////////////FUNCTIONS STARTS FROM HERE/////////////////////////
 async function test() {
  setProgress(80)
   let y = await getUserAndReciever({user_id:id as string});//return array in which first ele is user data and second is reciever data if reciever id passed
  //  console.log(y);
   if (y.status == true) {
    setProgress(90);
     setUser({
       id: y.data[0]?.id,
       name: y.data[0]?.name,
       username: y.data[0]?.username,
       email: y.data[0]?.email,
       profile:y.data[0]?.profile
     });
     if (!y.data[0]?.isVerified) {
       setVerified(false);
     }
   } else {
    router.replace('/')//redirecting to home if id is not correct
    
   }
   console.log(y.data)
 }
    ///////////////////////////////
    async function openDialog(){
        detailsDialog?.current?.showModal();
    }
    ///////////////////////////////
async function updateusername(data:FormData){
if(isUnique){
    let res=await updateUsername(id as string,data.get("username") as string);
    await test()
//     console.log(res,res.username)
// console.log(data.get("username"))
}
}
/////////////////////////
function checkUsername1(username: string) {
  if (username.length > 0) {
    setIsSearching(true)
    if (timer) {
      clearTimeout(timer);
    }
    let newTimer = setTimeout(async () => {
      let isUser = await checkUsername(username);
      if (isUser) {
        setIsUsernameAvailable("username is already taken");
        setIsUnique(false);
      }

      if (!isUser){
        setIsUsernameAvailable("username is available");
        setIsUnique(true)
      }
    }, 1800);

    setNewTimer(newTimer);
  } else if (username.length == 0) {
    if (timer) {
      clearTimeout(timer);
    }
    setIsUsernameAvailable("");
    setIsSearching(false)
  }
}
/////////////////////////
async function changeprofile(data:FormData){
    //@ts-ignore
    if(data.get('pic').size>0){
      let res=await changeProfile(data,id as string);
test()//updating profile
    }

    
}


///////////////////
 useEffect(()=>{
    test()//setting user data on page load
 },[])
    
    return(
        <>
         <div className="shadow-sm">
         <Navbar background="bg-white"/>
         </div>
        <div className="sm:p-6 p-3 md:p-10">
         
        {user?(<>
            <dialog ref={detailsDialog} className="px-4 py-5 rounded-md shadow-md relative top-50% " >
                <span className="inline-block absolute top-3 right-5 cursor-pointer" onClick={()=>{detailsDialog.current?.close()}}>X</span>
                <div className="text-center text-2xl text-gray-900 font-semibold my-3">Fill Details</div>
                <form action={updateusername} className="px-4 ">
                    <div className="flex gap-4">
                    <label htmlFor="username" className="block my-2">Username</label>
                    <Input placeholder="enter username..." id="username" name="username" onChange={(e)=>checkUsername1(e.target.value)}  />
                    </div>
                    {isSearching?(<>
                    {isUsernameAvailable=="username is available"?(<>
                        <div className="text-center text-xs text-green-500 my-3 px-2">{isUsernameAvailable}</div>
                    </>):(<>
                        <div className="text-center text-xs text-red-600 my-3 px-2">{isUsernameAvailable}</div>
                    </>)}
                        
                    </>):(<></>)}
                    <div className="text-center mt-5">
                        <Button className="w-1/2">Submit</Button>
                    </div>
                </form>
            </dialog>
            <div className="profile ">
                <h1 className="text-gray-800 text-3xl sm:text-4xl font-medium px-10 text-center" >Profile Picture</h1>
                <div className=" flex justify-center items-center mt-6 mx-auto px-4 sm:px-0" >
                    {/* <Image src={user?.profile?user.profile:"/profiles/default-profile.jpg"}  alt="profile pic" quality={100}  width={400} height={400} className=" rounded-full object-contain overflow-hidden" ref={imageSrc} /> */}
                    <img src={user?.profile?user.profile:"/profiles/default-profile.jpg"} alt="profile pic..." className="w-60 h-60 rounded-full" />
                    
                </div>
                <div className="flex justify-center items-center my-5 flex-col gap-4">
                    <form action={changeprofile} ref={profileForm}>
                      <Input type="file" name="pic" accept="image/png, image/jpeg"/>
                      {/* <input type="file" name="pic" accept="image/png, image/jpeg" /> */}
                      </form>
                   <span className="inline-block cursor-pointer underline" onClick={()=>{profileForm.current?.requestSubmit()}}>
                    Change Profile Picture
                   </span>
                </div>
            </div>
             <div className="user_details my-4 py-4 sm:py-10 px-3 sm:px-14 max-w-4xl mx-auto">
                {verified?(<></>):(<>
                <div className="warning flex flex-col my-5 bg-red-400 px-6 py-6 rounded-3xl">
                    <h2 className="font-semibold text-white text-xl text-center">Please verify your account first and provide user details to get started.</h2>
                    <a href={`/verification/${user?.id}`} className="w-1/3 mx-auto"><button className="w-full bg-white text-red-500 mt-5 py-3 text-xl rounded-md">Verify</button></a>

                </div>
                </>)}
                <div className="my-2">
                    <h1 className="text-gray-800 text-3xl sm:text-4xl font-medium px-10 text-center">User Details</h1>
                </div>
               
                {/* username */}
                <div className="username flex px-1 sm:px-10 justify-centers items-center my-5">
                    <p className="text-gray-900 font-medium text-xl w-36 text-left">Username: </p>
                    <p className="w-full px-5 py-2 rounded-3xl text-base sm:text-lg border border-solid mx-1 text-gray-800 bg-gray-50 font-light text-wrap text-clip overflow-scroll no-scrollbar">{user?.username?user.username:"not-set"}</p>
                   {user?.username?(<></>):( <span className="inline-block mx-2 underline cursor-pointer text-gray-800" onClick={()=>{openDialog()}}>set</span>)}
                    
                   
                </div>
                {/* EMAIL */}
                <div className="email flex px-1 sm:px-10 justify-centers items-center my-5 overflow-hidden">
                    <p className="text-gray-900 font-medium text-xl w-36 text-left">Email: </p>
                    <p className="w-full px-5 py-2 rounded-3xl text-base sm:text-lg border border-solid mx-1 text-gray-800 bg-gray-50 font-light text-wrap text-clip overflow-scroll no-scrollbar">{user?.email}</p>
                </div>
             </div>
        </>):(<>
        <div className="page_loading w-11/12 h-screen flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">
          <Progress className="w-56 h-3" value={progress}/>
<p>loading...</p>
          </div>
        </div>
        </>)}
        </div>
        </>
    )
}
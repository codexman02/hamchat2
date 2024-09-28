"use client"
import { User } from "@/app/models/User"
import { useParams } from "next/navigation";
import { verification } from "@/app/utils/crud/functions";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
export default function VerificationPage(){
    const {toast}=useToast()
    const [first,setFirst]=useState<string >("");
    const [second,setSecond]=useState<string >("");
    const [third,setThird]=useState<string >("");
    const [fourth,setFourth]=useState<string>("");
    const param=useParams()
    const id=param.id
   async function submit(){
        let val=first+second+third+fourth;
         let y=await verification({id,code:val})
         console.log(y)
       if(y?.status==false){
        toast({
             variant:"destructive",
            title:"Oops Something went wrong",
            description:y.message
           
        })
       }else{
        toast({
            variant:'default', 
            title:"Congrats!",
            description:y?.message
        })
       }
    }

   
//     function runFirst(e:ChangeEvent<HTMLInputElement>){
// if(first.length==1 && e.target?.value.length>1){  
// e.target.nextSibling?.focus()
//     return
// }else if(e.target.value.length==0){
//     setFirst(e.target?.value)
   
// }else{
//     setFirst(e.target?.value)
//  e.target.nextSibling.focus()
// }
//     }
//     function runSecond(e:Event){
// if(second.length==1 && e.target.value.length>1){  
// e.target.nextSibling.focus()
//     return
// }else if(e.target.value.length==0){
//     setSecond(e.target?.value)
   
// }else{
//     setSecond(e.target?.value)
//  e.target.nextSibling.focus()
// }
//     }
//     function runThird(e:Event){
// if(third.length==1 && e.target.value.length>1){  
// e.target.nextSibling.focus()
//     return
// }else if(e.target.value.length==0){
//     setThird(e.target?.value)
   
// }else{
//     setThird(e.target?.value)
//  e.target.nextSibling.focus()
// }
//     }
//     function runFourth(e:Event){
// if(fourth.length==1 && e.target.value.length>1){  
// // e.target.nextSibling.focus()
//     return
// }else if(e.target.value.length==0){
//     setFourth(e.target?.value)
   
// }else{
//     setFourth(e.target?.value)
// //  e.target.nextSibling.focus()
// }
//     }
    return(
        <>
        <h1>Verify your account</h1>
        <div className="w-full p-10 flex">
            <input type="number"  className="otps border border-solid w-16 h-16 text-center text-2xl mx-1" value={first} onChange={(e)=>{setFirst(e.target.value)}}/>
            <input type="number" value={second} onChange={(e)=>{setSecond(e.target.value)}}  className="otps border border-solid w-16 h-16 text-center text-2xl mx-1"/>
            <input type="number" value={third} onChange={(e)=>{setThird(e.target.value)}}  className="otps border border-solid w-16 h-16 text-center text-2xl mx-1"/>
            <input type="number" value={fourth} onChange={(e)=>{setFourth(e.target.value)}} className="otps border border-solid w-16 h-16 text-center text-2xl mx-1"/>
            <Button className="mx-2 h-16 px-3 text-lg" onClick={()=>submit()}>Verify</Button>
        </div>

        </>
    )
}
"use cient"
import Picker from "emoji-picker-react";
import { useState } from "react";
export default function Emoji(){
    const [inputStr,setInputStr]=useState("");
    const [showPicker,setShowPicker]=useState(false);
    const onEmojiClick=(event:any)=>{
        // console.log(emojiObject.emoji,emojiObject,event.emoji)
        setInputStr(prev=>prev+event.emoji);
        console.log(inputStr)
        // setShowPicker(false);
    }
    return(
        <div>
            <input type='text' value={inputStr} className="p-4 border border-solid border-gray-400" onChange={(e)=>{setInputStr(e.target.value)}}/><button onClick={()=>setShowPicker(val=>!val)}>Select</button>

{showPicker &&  <Picker  lazyLoadEmojis={true}   onEmojiClick={onEmojiClick}/>}

           
        </div>
    )
}
{/* <Picker emojiStyle="google" reactionsDefaultOpen={true} suggestedEmojisMode="frequent"  onEmojiClick={onEmojiClick}/> */}
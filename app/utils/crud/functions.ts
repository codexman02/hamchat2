"use server";
import { User } from "@/app/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { mail } from "../mail";
import { Message, Messages } from "@/app/models/Messages";
import { ObjectId } from "mongoose";
import { pusher } from "@/lib/pusher";
import { parse } from "path";
import fs from 'fs'
import {writeFile} from 'fs/promises'
import { fileType } from "@/app/types/fileType";
import { v4 as uuidv4 } from 'uuid';
import {io} from "socket.io-client"
import { Requests } from "@/app/models/Requests";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Group } from "@/app/models/Group";
import { dbConnect } from "../db";
// let socket=io("http://localhost:5000");
type data = {
  username: string;
  email: string;
  password: string;
};
export async function signupFunction(data: data) {
  await dbConnect();
  let pass = await bcrypt.hashSync(data.password, 10);
  let user = await User.User.findOne({
    $or: [{ username: data.username }, { email: data.email }],
  });

  if (user) {
    if (user.username == data.username) {
      return {
        status: false,
        message: "this username already exists",
      };
    } else if (user.email == data.email) {
      return {
        status: false,
        message: "this email already exists",
      };
    }
  } else {
    const code = await Math.floor(1000 + Math.random() * 9000);
    const date = new Date(Date.now() + 172800000);
    const newUser = new User.User({
      name:null,
      username: data.username,
      email: data.email,
      password: pass,
      isVerified: false,
      VerificationCode: code,
      VerificationExpiry: date,
      contacts:[],
      contactList:[],
      groups:[]
    });
    let result = await newUser.save();
    mail({message:"This is a verification email to verify your account on HamChat",code:code,id:result._id.toString(),email:result.email})
    console.log(result, "new user");

    return {
      status: true,
      message: "Account Created",
    };
  }

  console.log(user);
}
////////////SIGNUP FUNCTION ENDS HERE

//////VERIFICATION FUNCTION STARTS HERE
export async function verification({id,code}:{id:string | string[],code:string}){
  const user=await User.User.findOne({_id:id})
  if(user.isVerified==false){
    if(user.VerificationExpiry.toLocaleString()>new Date(Date.now()).toLocaleString()){
      if(user.VerificationCode==code){
        const updatedUser= await User.User.updateOne({_id:id},{
          isVerified:true,
          VerificationCode:null,
          VerificationExpiry:null
        })
        
        console.log(updatedUser,"expire nhi hua abhbi")
        return {
          status:true,
          message:"Your account was verified Successfully"
        }
      }
      
    }else{
      return {
        status:false,
        message:"Your code is expired please get a new code"
      }  
    }
  }else{
    return {
      status:false,
      message:"Your account is already verified"
    } 
  }
  

  console.log(user,"verify horha")
console.log(id,code,"verify ho rha")

}
//////VERIFICATION FUNCTION ENDS HERE

//////GET USER FUNCTION
export async function getUserAndReciever({user_id,reciever_id}:{user_id?:string,reciever_id?:string}){
try {
  let user=await User.User.findOne({_id:user_id});
  let reciever;
  if(reciever_id){
     reciever=await User.User.findOne({_id:reciever_id},{_id:0,username:1,email:1,isVerified:1,profile:1});
  }
  // console.log(user,"ji ye user hai")
if(user){
  return {
    status:true,
    data:[{
      // id:user._id.toJSON(),
      username:user.username,
      name:user.name?user.name:user.username,
      email:user.email,
      isVerified:user.isVerified,
      profile:user.profile

    },reciever]
  }
}else{
  return {
    status:false,
    message:"This user does not exits",
    data:[{
      id: "",
      email: "",
      username: "",
      name: "",
      isVerified: false,
      profile:""
    }]
  }
}
} catch (error) {
  return {
    status:false,
    message:"This user does not exits",
    data:[{
      id: "",
      email: "",
      username: "",
      name: "",
      isVerified: false,
      profile:""
    }]
  }
 console.log(error) 
}
}
//////GET USER FUNCTION END HERE

///////GET MESSAGES STARTS HERE
export async function getMessages(id:string[] | string){
let user=await User.User.findOne({_id:id})
let i=JSON.stringify(user)
let arr:any=[]

if(user){
  let userArray=user.contacts
  
  let users=await User.User.find({_id:{$in:userArray}})
  // console.log(users,"users hai")
  users.map((ele:any)=>{
    // console.log(ele,"ele hai")
    user.contactList.forEach((ele2:any)=>{
      // console.log(ele2,"same")
      if(ele2.contact_id==ele._id){
     
        let a:any={}
        a.username=ele.username
        a.name=ele.name?ele.name:ele.username
        a.email=ele.email
        a.lastMessage=ele2.lastMessage 
        a.contact_id=ele2.contact_id
        a.profile=ele.profile
        
        arr.push(a)
        // console.log(ele2,"pushing in a array")
      }
    })
  })
  // console.log(user,"contacts")
  // console.log(users)
  let userData=JSON.stringify(arr)
  // console.log(arr)
  return [{userData,i}]

      
  
}else if(!user){
  console.log("no t founded")
 return false
}
}

///////GET MESSAGES ENDS HERE

 export async function getChat(id:string[]){
  // console.log(arr,"contacts")
  let ids=id.sort();
  const chat=await Messages.find({users:ids})
  console.log(id.sort(),"cgat1")
  if(chat.length>0){
    let data=JSON.stringify(chat)
    return {
      status:true,
      data:data
    }
    
  }else{
    let request=await Requests.find({users:id.sort()})
    if(request.length>0){
      let data=JSON.stringify(request);
      return{
        status:true,
        request:data
      }
    }else{
      return {
        status:false,
        message:"Messages does not exists."
      }
    }
  }
  

// console.log(arr)
}
//SUBMIT NEW MESSAGE FUNCTION STARTS HERE
export async function submitNewMessages(message:{content:string,messageId?:string,sentBy:string,sentAt:string,seenBy:string[]},users:string[],sender:string,reciever:string){
// let updateLastMessage=User.User.updateMany({$or:{}})
let  ids=users.sort();
// message.messageId=uuidv4();
console.log(message)
let user=(await Messages.updateOne({users:ids},{$push:{messages:message}}));
console.log(user,"users in chat")
let x=users.sort()
let channelName=x[0]+x[1]
console.log(channelName,"channelName")
 pusher.trigger(channelName,"new-message",message)
// console.log(res,"resof pusher")
// console.log(message)
// console.log(user,"user hai ye")
// let data={
//   contact_id:user1._id.toString(),lastMessage:{content:"last",sentAt:Date.now()},numberOfNewMessages:1
// }
console.log(reciever,sender)
let contactUpdate=await User.User.updateOne({$and:[{_id:reciever},{contactList:{$elemMatch:{contact_id:sender.toString()}}}]},{$set:{"contactList.$":{contact_id:sender,lastMessage:{content:message.content,sentAt:new Date(Date.now())},numberOfNewMessages:1}}});
let contactUpdate2=await User.User.updateOne({$and:[{_id:sender},{contactList:{$elemMatch:{contact_id:reciever.toString()}}}]},{$set:{"contactList.$":{contact_id:reciever,lastMessage:{content:message.content,sentAt:new Date(Date.now())},numberOfNewMessages:1}}});
console.log(contactUpdate,"contact updated");
}

//SUBMIT NEW MESSAGE FUNCTION ENDS HERE


export async function saveImage(data:FormData,users:string[],userData:{sentBy:string,seenBy:string[]}){
  
  let returnData2:any=[]
   
    let image=data.get("file") as {name:string,arrayBuffer:any,type:string}
    let id = uuidv4();
    let name=image?.name.replace(/\s+/g, '');
    let src=id as string+name;
    let byteData=await image?.arrayBuffer();
    let buffer=Buffer.from(byteData);
    await writeFile(`./public/chatImages/${src}`,buffer);

    let message = {
      contentType: "file",
      content: null,
      image: {
        name: image?.name,
        src: `/chatImages/${src}`,
        type: image?.type,
        image_id: id,
      },
       sentBy: userData.sentBy,
      sentAt: new Date(Date.now()).toLocaleString(),
      seenBy: userData.seenBy,
    };
   console.log(message)
    
    // let result=await Messages.updateOne({users:{$elemMatch:{$eq:users[0],$eq:users[1]}}},{$push:{messages:message}});
    // console.log(result,"image saved")
   return message
}
export async function saveAudio(data:any,user:{email:string}){
  let audio=data.get("audio")
  let id=uuidv4();
  let src=id as string+"recorded_File.wav"
  let audioInfo={
    contentType:"file",
    content:null,
    image:{
      name:"recorded audio",
      src:`/chatImages/${src}`,
      type:"audio/wav",
      image_id:id
    },
    sentBy:user.email,
    sentAt: new Date(Date.now()).toLocaleString(),
    seenBy:[user.email]

  }
  let byteData=await audio?.arrayBuffer();
  const buffer = new Uint8Array(byteData);
  await writeFile(`./public/chatImages/${src}`, buffer);
  return audioInfo
console.log(audioInfo)  
  
}


//CREATE CONTACTS FUNDTION STARTS HERE
export async function createContact({id1,username1,username2}:{id1:string,username1:string,username2:string}){
  let user2=await User.User.findOne({username:username2});
  let arr=[id1,user2._id.toString()];
 let ids=arr.sort();
 let isMessages=await Messages.findOne({users:ids});
 let messageContent;

 if(isMessages){
  let user1=await User.User.findOne({_id:id1});
 let messageArr=isMessages.messages;
 let lastMessage=messageArr.slice(messageArr.length-1,messageArr.length);
 ///////////////////
 let data={
  contact_id:user2._id.toString(),lastMessage:{content:lastMessage[0].content,sentAt:new Date(Date.now())},numberOfNewMessages:1
}
  let data2={
  contact_id:id1.toString(),lastMessage:{content:lastMessage[0].content,sentAt:new Date(Date.now())},numberOfNewMessages:1
}
// findOne({$and:[{contacts:{$elemMatch:{$eq:"66b0f1334525fe2e5f160983"}}},{_id:ObjectId("66b0ef3f4525fe2e5f160979")}]},{email:1});
let isAdded=await User.User.findOne({$and:[{contacts:{$elemMatch:{$eq:user2._id}}},{_id:id1}]},{email:1});
 if(isAdded){
  console.log("i am returned",isAdded)
  return
 }else{
  let contactUpdate1=await User.User.updateOne({_id:id1},{$push:{contactList:data,contacts:user2._id.toString()}});
  console.log(contactUpdate1,"contactadeed")
 }

  // let contactUpdate2=await User.User.updateOne({_id:user2._id},{$push:{contactList:data2,contacts:id1.toString()}});
 ///////////////
//  console.log(lastMessage,"slice lasdt message")
 }else{
  let data={
    contact_id:user2._id.toString(),lastMessage:{content:`${username1} wants to start a conversation`,sentAt:new Date(Date.now())},numberOfNewMessages:1
  }
    let data2={
    contact_id:id1.toString(),lastMessage:{content:`${username1} wants to start a conversation`,sentAt:new Date(Date.now())},numberOfNewMessages:1
  }
  console.log(data)
   
   
    let contactUpdate1=await User.User.updateOne({_id:id1},{$push:{contactList:data,contacts:user2._id.toString()}});
    let contactUpdate2=await User.User.updateOne({_id:user2._id},{$push:{contactList:data2,contacts:id1.toString()}});
    let request=await Requests.create({users:ids,requestTo:username2,requestedBy:username1,accepted:false})
    // console.log(request,"request made")
 }



}
//CREATE CONTACTS FUNDTION ENDS HERE


export async function createMessageDocument({type,ids,rejectedBy,requestedBy,user}:{type:string,ids:string[],rejectedBy?:string,requestedBy?:string,user?:string}){
  let users=await User.User.find({_id:{$in:ids}},{username:1});
  let sender:({_id:string,username:string} | undefined);
  let reciever:({_id:string,username:string} | undefined);
  users.forEach((el:{_id:string,username:string})=>{
   if(el.username==user){
    sender=el
   }else{
    reciever=el
   }
  })

try {
    if(type=="rejected"){
      let request=await Requests.updateOne({users:ids},{$set:{rejected:true,rejectedBy:rejectedBy}});
    
  console.log(request,"message document created");
  return true
    }else if(type=="again"){
      let request=await Requests.updateOne({users:ids},{$set:{rejected:false,requestedBy:sender!.username,requestTo:reciever?.username}})
      console.log(ids,requestedBy,type)
    }else if(type=="accepted"){
      let request=await Requests.updateOne({users:ids},{$set:{accepted:true}});
       
        let y=await Messages.find({users:ids});
        if(y.length>0){
          console.log(y,"ye y hai bhai")
          return
        }else{
 let creation=await Messages.insertMany([{users:ids,messages:[],blockList:null,groups:null}]);
 console.log(creation,"hehe2");
        }
  
      // console.log(request)
      console.log("accepted")
    }
} catch (error) {
 console.log(error,"err occured") 
 return false
}
// redirect("/messages/668509940d7fddaaed1db33c/chats/668512f00d7fddaaed1db364")
}


export async function getHeaders(){
  const serverHeaders=headers();
  return serverHeaders;
}
export async function getUSer(data:string){
let user=await User.User.findOne({$or:[{email:data},{username:data},{_id:data}]});
if(user){
  let data=JSON.stringify(user);
  return {data:data}
}else{
  return {data:"No User Found"}
}
}
export async function deleteContacts(user_id:string,contact_id:string){
  try {
    let operation=await User.User.updateOne({_id:user_id},{$pull:{contacts:{$eq:contact_id}}});
    let operation2 = await User.User.updateOne({_id:user_id},{$pull:{contactList:{contact_id:contact_id}}})
    console.log(operation,operation2)
  console.log(user_id,contact_id,"deleted");
 if(operation.modifiedCount==1 && operation2.modifiedCount==1){
  return {
    status:true,
    message:"Contact was deleted"
  }
 }
 else{
  return {
    status:false,
    message:"Sorry there was some error deleting your contact, please try again later"
  }
 }
  } catch (error) {
    console.log(error)
  }
}


export async function editMessage(id:string,message:string){
  let updation=await Messages.updateOne({"messages.messageId":id},{$set:{"messages.$.content":message}});
  if(updation.matchedCount==1){
    console.log("true")
    return true
  }else{
    console.log("false")
    return false
  }
console.log(updation,"message updated");
}
 
export async function createGroup(user_id:string,groupname:string,users:{user_id:string,hasAccepted:boolean}[]){
  let admin=await User.User.findOne({_id:user_id},{username:1,email:1});
  let adminData={
    user_id:user_id,
    hasAccepted:true,
    isAdmin:true,
    username:admin.username,
    email:admin.email
  }
  let group_id=uuidv4();
  let group=await new Group({
    groupName:groupname,
    messages:[],
    members:adminData,
    group_id:group_id,
    admin:user_id,

  })
  let data={
    group_id:group_id,
    groupName:groupname,
    members:users,
    lastMessage:{
      content:"created a group",
      sentAt:new Date(Date.now())
    }
  }
  console.log(data)
  let user=await User.User.updateOne({_id:user_id},{$push:{groups:data}});
  // console.log(user,"user")
  let result=await group.save();
  // console.log(result)
console.log(user_id,groupname,users)
}


export async function getGroups(id:string){
let groups=await User.User.findOne({_id:id},{groups:1});
// console.log(groups);
let data=JSON.stringify(groups.groups);
// console.log(data)
return data
}

export async function getGroupChat(id:string){
  let chats=await Group.findOne({group_id:id});
  let data=await JSON.stringify(chats);
  return data

}



export async function sendMessageGroup(data:{
  contentType:string | null,
  content?:string,
  messageId:string,
  image:string | null,
  sentBy:string,sentAt:string,seenBy:string[]
},id:string){

try {
  let result=await Group.updateOne({group_id:id},{$push:{messages:data}});
  if(result.modifiedCount==1){
    return true
  }
} catch (error) {
  console.log(error)
  return false
}

  console.log(data)

}
////////////////////////////////////////
export async function getUserGroup(id:string){
  let user=await User.User.findOne({_id:id},{email:1,username:1,profile:1});
  if(user){
    let data=JSON.stringify(user);
    return data
  }else{
    return false
  }
}
///////////////////////////
export async function deleteGroupMessage(group_id:string,message_id:string){
  let deleteMessage=await Group.updateOne({group_id:group_id},{$pull:{messages:{messageId:message_id}}});
  console.log(deleteMessage);
  if(deleteMessage.modifiedCount==1){
    return true
  }else{
    false
  }
  // console.log(group_id,message_id)
}


//////////////////////
export async function editGroupMessage(group_id:string,message_id:string,message:string){
  let edit=await Group.updateOne({$and:[{group_id:group_id},{"messages.messageId":message_id}]},{$set:{"messages.$.content":message}});
  console.log(edit)
  if(edit.modifiedCount==1){
    return true
  }else{
    return false
  }
// console.log(group_id,message_id,message)
}


////////////////////////////
export async function getGroupInfo(groupid:string){
  let group=await Group.findOne({group_id:groupid});
//  console.log(group.members,"group");
 let arr:any[]=[];
 await group.members.forEach((ele:any)=>{
arr.push(ele.user_id);
 })
//  console.log(arr,"arr")
  if(group){
    // console.log(group,"goup")
    // let members=await User.User.find({_id:{$in:[...arr]}},{username:1,email:1});
    // console.log(members,"members");
    // let a=members.forEach((ele)=>{
    //   console.log(ele,"member")
    // })
    let y=JSON.stringify(group)
    // let data=JSON.stringify(group);
    // let membersData=JSON.stringify(members);
    return y
  }else{
    return {
      status:false,
      message:"Error occured"
    }
  }
}

///////////////////////

export async function addGroupMember(groupid:string,user_id:string,groupName:string){
 let addedMember=await User.User.findOne({_id:user_id});
  let isGroup=await User.User.findOne({$and:[{_id:user_id},{"groups.group_id":groupid}]});
  if(!isGroup){
    let data={
      group_id:groupid,
      groupName:groupName,
      members:null,
      lastMessage:{content:"request from a group", sentAt:new Date(Date.now())}
    }
    let updateUserGroup=await User.User.updateOne({_id:user_id},{$push:{groups:data}});//adding group to requested user data
  };
let memberData={
  user_id:user_id,hasAccepted:false,isAdmin:false,username:addedMember.username,email:addedMember.email,profile:addedMember.profile
}
  let res=await Group.updateOne({group_id:groupid},{$push:{members:memberData}});
  console.log(res,"member added");
  if(res.modifiedCount==1){
    return true
  }else{
    return false
  }

}
///////////////////////////////////////
export async function GroupRequest(groupId:string,user_id:string){

  let accept=await Group.updateOne({$and:[{group_id:groupId},{"members.user_id":user_id}]},{$set:{"members.$.hasAccepted":true}});
  if(accept.modifiedCount==1){
    return true
  }else{
    return false
  }



}
////////////////////////////////////

export async function deleteMember(member_id:string,group_id:string){
  let res=await Group.updateOne({group_id:group_id},{$pull:{members:{user_id:member_id}}});
  console.log(res,"member from group deleted")
  let userUpdate=await User.User.updateOne({_id:member_id},{$pull:{groups:{group_id:group_id}}});
  console.log(userUpdate,"group from user table deleted")


}
////////////////////////////////////////
export async function checkUsername(username: string) {
  let user = await User.User.findOne({ username: username });
  if (user) {
    return true;
  } else {
    return false;
  }
}


/////////////////////////////////////
export async function updateUsername(id:string,username:string){
  let isUser=await User.User.findOne({username:username});
  if(isUser){
    return {
      status:"error",
      message:"this username is already taken"
    }
  }else{
    let updatedUser=await User.User.findOneAndUpdate({_id:id},{$set:{username:username}});
    console.log(updatedUser);
    return {
      status:"success",
      message:"username updated successfully",
      username:username
    }
  }
console.log(username,id)
}
//////////////////////////////////
export async function changeProfile(data:FormData,id:string){
  // let image=data.get("file") as {name:string,arrayBuffer:any,type:string}
  //   let id = uuidv4();
  //   let name=image?.name.replace(/\s+/g, '');
  //   let src=id as string+name;
  //   let byteData=await image?.arrayBuffer();
  //   let buffer=Buffer.from(byteData);
  //   await writeFile(`./public/chatImages/${src}`,buffer);
  const user=await User.User.findOne({_id:id});
  if(user.profile){
    let path=`./public${user.profile}`;
    fs.unlink(path,(err)=>{
      console.log(err)
    });
  }
  let image=data.get("pic") as {name:string,arrayBuffer:any};
  let src="/profiles/"+id+image.name;
  let byteData=await image.arrayBuffer();
  let buffer=Buffer.from(byteData);
  await writeFile(`./public${src}`,buffer);
let updatedProfile=await User.User.updateOne({_id:id},{$set:{profile:src}});
return {status:"profile changed",
  src:src
}
console.log(updatedProfile)
  console.log(image,src)
}

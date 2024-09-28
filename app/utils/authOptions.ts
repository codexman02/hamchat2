import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { User } from "../models/User";
import { dbConnect } from "./db";
import { mail } from "./mail";
import bcrypt from "bcryptjs"
import { AuthOptions } from "next-auth";
export const authOptions:AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      id:"credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text", placeholder: "enter username or email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials,req):Promise<any> {
        await dbConnect();
   
   try{
    const user=await User.User.findOne({$or:[{email:credentials?.username},{username:credentials?.username}]});
    console.log(user,"teste1")
    if(user){
        let isValid=await bcrypt.compare(credentials!.password,user.password)
        if(isValid){
          console.log("valid hai")
          return user;
        }else{
          console.log(credentials?.password,user.password,"baiid nh hai")
          return null
        }
      console.log(user,"test")
      
     }else{
      return null;
     }
   }catch(err){
    
console.log(err);
   }
      }
    })
    // ...add more providers here
  ],
  callbacks:{
    async signIn({ user}) {
        //  mail()
       let a=await User.User.findOne({email:user.email});
      //  console.log(a)
       if(a){
       
        
        return true
       }else{
        
        let newUser=new User.User({
          name:null,
          username:null,
          email: user.email,
          password: null,
          isVerified: false,
          VerificationCode: null,
          VerificationExpiry: null,
          profile:null
        });
       
        let result = await newUser.save()

       
        return true
       }
      
        
      
      },
      async session({session}){
        // session.user.test="testing1";
      let user=await User.User.findOne({email:session.user.email});
      if(user){
        session.user._id=user._id.toString();
        session.user.isVerified=user.isVerified; 
        session.user.username=user.username
        // console.log(user,"use from the auth option session function thank yuou")
      }
      //  console.log(session,"token")
       return session
      }
  },
  
}
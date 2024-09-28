import NextAuth, {DefaultSession} from "next-auth/next";

declare module "next-auth"{
    interface Session{
        user:{
            username?:string,
            email?:string,
            _id?:string
            isVerified:boolean,
            

        }
    }
    interface User {
        username?:string
    }
}

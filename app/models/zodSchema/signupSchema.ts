import { z } from "zod";
export const signupSchema=z.object({
    username:z.string().min(3,{message:"username must be greater than 3 characters"}),
    email:z.string().email("This is not a valid email"),
    password:z.string().min(3,{message:"Password length must be greater than 3 characters"})
})
"use client"
import {z} from "zod"
import bcrypt from "bcryptjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupSchema } from "@/app/models/zodSchema/signupSchema"
import { Form, FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signupFunction } from "@/app/utils/crud/functions"
import { useToast } from "@/components/ui/use-toast"
export default function SignUpPage(){
    const {toast}=useToast()
    const form=useForm<z.infer<typeof signupSchema>>({
        resolver:zodResolver(signupSchema),
        defaultValues:{
            username:"",
            email:"",
            password:""
        }
 
    })
 async function onSubmits(data:z.infer<typeof signupSchema>){
    let pass=await bcrypt.hashSync(data.password,10)
    let user={
        username:data.username,
        email:data.email,
        password:data.password
        
    }
   let y=await signupFunction(user)
    if(y?.status==false){
toast({
    variant:"destructive",
    title:"Oops Something Went Wrong",
    description:y.message
})
    }else if(y?.status==true){
        toast({
            variant:"default",
            title:"Your account was ceated successfully!, an email has been sent with verification code please verify your account.",
            description:y.message
        })
    }
    console.log(y,"submitted")
    console.log(data)
   } 
    return(
<>
<div className="w-full py-10 px-10 h-screen flex flex-col">
    <div className="flex flex-col my-auto ">
        
<div className="form_container w-2/5 mx-auto border border-solid shadow-md px-7 py-7 rounded-2xl">
<h2 className="font-medium text-4xl text-center">SignUp Form</h2>
    <Form {...form} >
<form onSubmit={form.handleSubmit(onSubmits)} className="w-full py-8">
    <FormField
    
    control={form.control}
    name="username"
    render={({field})=>(
        <FormItem className="my-2">
            <FormLabel className="font-normal text-gray-800 text-xl mx-1">Username</FormLabel>
            <FormControl>
                <Input placeholder="enter username" {...field}/>
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
    />
    <FormField
    control={form.control}
    name="email"
    render={({field})=>(
        <FormItem className="my-2">
            <FormLabel className="font-normal text-gray-800 text-xl mx-1">Enter Email</FormLabel>
            <FormControl>
                <Input type="email" placeholder="enter your email" {...field}/>
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
    />
    <FormField
    control={form.control}
    name="password"
    render={({field})=>(
        <FormItem className="my-2">
            <FormLabel className="font-normal text-gray-800 text-xl mx-1">Enter Password</FormLabel>
            <FormControl>
                <Input type="password" placeholder="enter password" {...field}/>
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
    />
<Button type="submit" className="mt-4">Submit</Button>
</form>

    </Form>
</div>
    </div>
</div>
</>
    )
}
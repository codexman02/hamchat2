import Link from "next/link";

export default function Footer(){
    return(
        <main className="bg-gray-800">
        <div className="footer_box grid grid-cols-2  p-5">
<div className="w-full">
 <div className="px-3">
    <h2 className="text-white font-medium text-3xl">Quick Links</h2>
 </div>
 <ul className="px-5 py-5">
    <li className="text-white underline text-sm my-1"><Link href={"/"}>Home</Link></li>
    <li className="text-white underline text-sm my-1"><Link href={"/"}>Messages</Link></li>
    <li className="text-white underline text-sm my-1"><Link href={"/"}>Groups</Link></li>
 </ul>
</div>
<div className="flex justify-center items-center">
    <p className="text-white font-semibold text-3xl">HamChat</p>
    
</div>
        </div>
        <div className="w-full text-center py-2 text-xs font-light  text-white">
         copyright@hamchat2024
        </div>
        </main>
    )
}
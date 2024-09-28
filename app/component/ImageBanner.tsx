import { Navbar } from "./Navbar";

export default function ImageBanner(){
    return (
        <>
        
        <div className="w-full h-96 border border-solid p-1 bg-gray-300">
            <div className="navbar_box w-full mx-auto  mt-4  flex h-14 px-14">
            {/* <div className="logo mx-3">
                <Image width={70} height={70} className="rounded-full" alt="logo" src={'/HamChat.png'} />
            </div> */}
            <div className="w-full rounded-full bg-white"><Navbar background="transparent" height="h-full"/></div>
            </div>
            
            </div>
        </>
    )
}
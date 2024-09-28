import Footer from "./Footer";
import ImageBanner from "./ImageBanner";
import ImageRightWithText from "./ImageRightWithText";
import ImageWithText from "./ImageWithText";
import { Navbar } from "./Navbar";


export default function HomePage(){
    
    return(
<>
<div>
  {/* <Navbar/> */}
  <ImageBanner/>
  {/* <ImageWithText/>
  <hr />
  <ImageRightWithText/> */}
  <div className="w-full py-6 my-2">
    <h1 className="text-center text-4xl my-3 text-gray-800 font-medium">Our Features</h1>
    <div className="card_container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5 sm:px-8 md:px-10 lg:px-16 py-5">
{/* CARD START HERE  */}
    <div className="card w-full border border-solid border-gray-200 flex flex-col gap-2 sm:py-4 rounded-lg shadow-md px-0 sm:px-6">
    <video autoPlay muted loop controls={false} className="w-1/3 mx-auto h-16 ">
          <source src="./message.mp4" type="video/mp4"></source>
          </video>
         <div className="w-full flex justify-center flex-col items-center grow sm:grow my-2 px-2 sm:px-4">
         
         <h2 className="title text-2xl sm:text-3xl font-normal text-gray-800 text-center">Messaging </h2>
         <p className="description text-sm py-1 text-center mt-2">
      We provide free messaging services to our users without any limitations.
      </p>
         </div>
     
      </div>
      {/* CARD ENDS HERE  */}
      <div className="card w-full border border-solid border-gray-200 flex flex-col gap-2 sm:py-4 rounded-lg shadow-md px-0 sm:px-6">
    <video autoPlay muted loop controls={false} className="w-1/3 mx-auto h-16 ">
          <source src="./discussion.mp4" type="video/mp4"></source>
          </video>
         <div className="w-full flex justify-center flex-col items-center g grow my-2 px-2 sm:px-4">
         
         <h2 className="title text-2xl sm:text-3xl font-normal text-gray-800 text-center">GroupChat</h2>
         <p className="description text-sm py-1 text-center mt-2">
      We also support group chat where you can have your discussions with your group members.
      </p>
         </div>
     
      </div>
      {/* CARD2 ENDS HERE  */}

      <div className="card w-full border border-solid border-gray-200 flex flex-col gap-2 sm:py-4 rounded-lg shadow-md px-0 sm:px-6">
    <video autoPlay muted loop controls={false} className="w-1/3 mx-auto h-16 ">
          <source src="./file.mp4" type="video/mp4"></source>
          </video>
         <div className="w-full flex justify-center flex-col items-center g grow my-2 px-2 sm:px-4">
         
         <h2 className="title text-2xl sm:text-3xl font-normal text-gray-800 text-center">File Support</h2>
         <p className="description text-sm py-1 text-center mt-2">
      We support variuos file types like image,videos,audio and pdf files.
      </p>
         </div>
     
      </div>
      {/* CARD2 ENDS HERE  */}      
      <div className="card w-full border border-solid border-gray-200 flex flex-col gap-2 sm:py-4 rounded-lg shadow-md px-0 sm:px-6">
    <video autoPlay muted loop controls={false} className="w-1/3 mx-auto h-16 ">
          <source src="./user-security.mp4" type="video/mp4"></source>
          </video>
         <div className="w-full flex justify-center flex-col items-center g grow my-2 px-2 sm:px-4">
         
         <h2 className="title text-2xl sm:text-3xl font-normal text-gray-800 text-center">Privacy</h2>
         <p className="description text-sm py-1 text-center mt-2">
      We never share your data with any third party and your data is 100% safe and protected.
      </p>
         </div>
     
      </div>
      {/* CARD2 ENDS HERE  */}      
    </div>
  </div>
</div>
<div className="w-full">
  <Footer/>
</div>
</>

    )
}
export default function ImageRightWithText(){
    return(
        <>
         <div className="image_with_text w-full flex min-h-96 py-5 px-12 my-3">
         
         

          <div className="text_box w-1/2 flex justify-center items-center">
            <div className="my-auto px-2">
            <div className="py-2 mt-2">
                <h2 className="px-4 text-3xl font-medium text-gray-800 text-center">GroupChat</h2>
             </div>
             <div className="px-4">
                <p className="px-7 text-center py-3 text-gray-700 text-base font-light">HamChat also supports group chat where you can have your discussions with your group members. <br /> </p>
                
                <div className="px-7 mt-5 text-center">
                <button className="w-auto px-4 bg-green-700 text-white font-light py-2 rounded">Get Started</button>
                </div>
             </div>
            </div>
          </div>

 {/* IMAGE BOX STARTS HERE  */}
          <div className="image_box p-3 w-1/2">
            

            <div className="image1 border border-solid border-gray-100 shadow-sm overflow-hidden rounded-lg">
                <img src="./gr2.jpeg" className="object-cover w-full h-full" alt="" />

            </div>
           
             
          </div>
          
        </div>
        </>
    )
}
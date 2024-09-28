export default function ImageWithText(){
    return(
        <>
        <div className="image_with_text w-full flex min-h-96 py-5 px-12 my-3">
          <div className="image_box p-3 w-1/2">
            

            <div className="image1 border border-solid border-gray-100 shadow-sm overflow-hidden rounded-lg">
                <img src="./m1.jpeg" className="object-cover w-full h-full" alt="" />

            </div>
            {/* <div className="col-start-4 col-end-12 row-start-6 row-end-13 z-20 border border-solid border-gray-300 overflow-hidden rounded-xl">
            <img src="./gr.jpeg" className="object-fill w-full h-full" alt="" />
            </div> */}
             
          </div>
          {/* IMAGE BOX ENDS HERE  */}

          <div className="text_box w-1/2 flex justify-center items-center">
            <div className="my-auto px-2">
            <div className="py-2 mt-2">
                <h2 className="px-4 text-3xl font-medium text-gray-800 text-center">HamChat</h2>
             </div>
             <div className="px-4">
                <p className="px-7 text-center py-3 text-gray-700 text-base font-light">Start your journey with us and start chatting with your family and friends without any limitation. <br /> </p>
                
                <div className="px-7 mt-5">
                <button className="w-full bg-green-700 text-white font-light py-2 rounded">Join HamChat Now</button>
                </div>
             </div>
            </div>
          </div>
          
        </div>
        </>
    )
}
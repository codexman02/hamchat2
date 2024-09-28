import { Messages,Message } from "./models/Messages";
import { dbConnect } from "./utils/db";

import HomePage from "./component/HomePage";
async function test(){
  await dbConnect()
  console.log("db connected")
}

export default function Home() {
 test()
  return (
    <main className="">
    <HomePage/>
     {/* <Card/> */}
     
    </main>
  );
}

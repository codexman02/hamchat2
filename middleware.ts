
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt'
import { getSession, useSession } from 'next-auth/react';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authOptions } from './app/utils/authOptions';
import { dbConnect } from './app/utils/db';


 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest,response:NextResponse) {
  // dbConnect();
//   const session = await getServerSession(request,response,authOptions);
// console.log(session)
const token=await getToken({req:request,secret:process.env.NEXTAUTH_SECRET!});
if(!token){
  return NextResponse.redirect(new URL('/', request.url));
}
// console.log(token,"from middleware token");



}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/messages/:path*',"/groups/:path*"]
}
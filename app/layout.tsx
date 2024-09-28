
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionBox } from "./utils/sessionProvider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "./component/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HamChat",
  description: "HamChat Chat Application",
  
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionBox><body className={inter.className}>{children}<Toaster /><script defer src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js" integrity="sha512-Z8CqofpIcnJN80feS2uccz+pXWgZzeKxDsDNMD/dJ6997/LSRY+W4NmEt9acwR+Gt9OHN0kkI1CTianCwoqcjQ==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script></body></SessionBox>
    
    </html>
    
  );
}

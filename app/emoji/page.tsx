"use client"
import dynamic from 'next/dynamic';
import { useState } from 'react';

const EmojiPicker = dynamic(() => import('./emoji'), { ssr: false });

export default function Page() {
   
  return (
    <div>
<EmojiPicker/>
    </div>
  );
}

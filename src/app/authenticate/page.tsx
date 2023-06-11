'use client'

import { useAuthGoogle } from "@/hooks/useAuthGoogle"
import { useRouter } from 'next/navigation';

export default function Authenticate() {
  const {signInGoogle} = useAuthGoogle();
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button className="bg-red-700 py-2 px-6" onClick={signInGoogle}>
        Faça seu login
      </button>
      <button className="bg-sky-900 mt-4 py-2 px-6" onClick={() => router.push('/')}>
        Volta
      </button>
    </div>
  )
}
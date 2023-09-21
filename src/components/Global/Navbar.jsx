import { Localstorage } from "@/services/Localstorage"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

export const Navbar = () => {

  const router = useRouter()

  return (
    <div className="flex flex-wrap justify-between items-center p-4 w-full gap-4">
      <a className="flex title-font font-medium items-center text-primary-1">
        <span className="text-xl">Final Year Project</span>
      </a>
      <p onClick={() => router.push("/login")} className="text-white bg-primary-1 py-2 px-6 outline-none hover:bg-opacity-90 rounded text-base">
        Login
      </p>
    </div>
  )
}

export default Navbar
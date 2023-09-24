import React from "react"
import { Footer, Navbar, Login } from "@/components"

export default function login() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="container">
        <Navbar />
        <Login />
        <Footer />
      </div>
    </div>
  )
}

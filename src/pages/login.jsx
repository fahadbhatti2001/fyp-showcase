import React from "react"
import { Footer, Navbar, Login } from "@/components"

export default function LoginPage() {
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

import React from "react"
import { Footer, Navbar, Register } from "@/components"

export default function register() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="container">
        <Navbar />
        <Register />
        <Footer />
      </div>
    </div>
  )
}

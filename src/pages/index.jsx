import { Banner, Features, Footer, Navbar, Projects } from "@/components"
import React from "react"

export default function index() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="container">
        <Navbar />
        <Banner />
        <Projects />
        <Features />
        <Footer />
      </div>
    </div>
  )
}

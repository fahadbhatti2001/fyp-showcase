import { Banner, Community, Footer, Navbar, News, Projects } from "@/components"
import React from "react"

export default function Index() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="container">
        <Navbar />
        <Banner />
        <News />
        <Projects />
        <Footer />
      </div>
    </div>
  )
}

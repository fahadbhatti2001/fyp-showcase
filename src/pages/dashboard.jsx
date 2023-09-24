import { Sidebar, UseUserAuth } from "@/components"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

export default function Dashboard() {
  const { user } = UseUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (user == undefined) {
      router.push("/login")
    }
  })

  return (
    <>
      <Sidebar>
        <div className="">Dashboard</div>
      </Sidebar>
    </>
  )
}

import { Manage, Sidebar, UseUserAuth } from "@/components"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

export default function DashboardPage() {
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
        <Manage />
      </Sidebar>
    </>
  )
}

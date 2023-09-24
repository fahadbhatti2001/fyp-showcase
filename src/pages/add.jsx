import { Sidebar, UseUserAuth, Add } from "@/components"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

export default function AddPage() {
  // const { user } = UseUserAuth()
  // const router = useRouter()

  // useEffect(() => {
  //     if (user == undefined) {
  //         router.push("/login")
  //     }
  // })

  return (
    <>
      <Sidebar>
        <Add />
      </Sidebar>
    </>
  )
}

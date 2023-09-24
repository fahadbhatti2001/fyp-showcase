import { db } from "@/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { UseUserAuth } from "@/components"
import Link from "next/link"

export const Navbar = () => {
  const router = useRouter()

  const { user } = UseUserAuth()

  const [profile, setProfile] = useState({
    email: "",
    role: "",
    name: "",
  })

  useEffect(() => {
    if (user) {
      if (user.uid) {
        const getdata = async () => {
          const userDocRef = doc(db, "Users", user.uid)
          const userDocSnapshot = await getDoc(userDocRef)
          setProfile(userDocSnapshot.data())
        }
        getdata()
      }
    }
  }, [user])

  return (
    <div className="flex flex-wrap justify-between items-center p-4 w-full gap-4">
      <a className="flex title-font font-medium items-center text-primary-1">
        <span className="text-xl md:block hidden">Final Year Project</span>
        <span className="text-xl md:hidden block">FYP</span>
      </a>
      {profile.name == "" ? (
        <p
          onClick={() => router.push("/login")}
          className="text-white bg-primary-1 py-2 px-6 outline-none hover:bg-opacity-90 rounded text-base"
        >
          Login
        </p>
      ) : (
        <Link
          href={profile.role == "ADMIN" ? "/admin" : "/dashboard"}
          className=""
        >
          {profile.name}
        </Link>
      )}
    </div>
  )
}

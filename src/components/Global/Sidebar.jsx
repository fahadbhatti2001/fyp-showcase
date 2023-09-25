import { db } from "@/FirebaseConfig"
import {
  NewspaperIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  FolderArrowDownIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { UseUserAuth } from "@/components"
import Link from "next/link"
import { useRouter } from "next/router"

export const Sidebar = (props) => {
  const [profile, setProfile] = useState({
    email: "",
    role: "",
    name: "",
  })

  const { children } = props

  const router = useRouter()

  const Menus = [
    { title: "Project", icon: FolderIcon, path: "/admin", role: "ADMIN" },
    { title: "Approved", icon: CheckCircleIcon, path: "/approved", role: "ADMIN" },
    { title: "Decline", icon: XCircleIcon, path: "/decline", role: "ADMIN" },
    // { title: "News", icon: NewspaperIcon, path: "/news", role: "ADMIN" },
    {
      title: "My Project",
      icon: FolderIcon,
      path: "/dashboard",
      role: "STUDENT",
    },
    {
      title: "Upload Project",
      icon: FolderArrowDownIcon,
      path: "/add",
      role: "STUDENT",
    },
  ]

  const { user, logOut } = UseUserAuth()

  const Logout = async () => {
    await logOut()
    router.push("/login")
  }

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
    <>
      <div className="flex flex-wrap justify-between items-center p-4 w-full gap-4">
        <a className="flex title-font font-medium items-center text-primary-1">
          <span className="text-xl md:block hidden">Final Year Project</span>
          <span className="text-xl md:hidden block">FYP</span>
        </a>
        <p className="">{profile.name}</p>
      </div>
      <div className="flex bg-white">
        <div className="w-16 body-height px-3 relative duration-300 flex flex-col justify-between">
          <div className="">
            {Menus.map(
              (e, i) =>
                e.role == profile.role && (
                  <Link
                    href={e.path}
                    key={i}
                    className={
                      "mt-2 flex rounded-md p-2 cursor-pointer hover:bg-zinc-200/20 text-gray-300 text-sm items-center gap-x-4"
                    }
                  >
                    <e.icon
                      title={e.title}
                      className="w-5 h-5 text-primary-1"
                    />
                  </Link>
                ),
            )}
          </div>
          <button
            onClick={() => Logout()}
            className="mb-4 flex rounded-md p-2 cursor-pointer hover:bg-zinc-200/20 text-gray-300 text-sm items-center gap-x-4"
          >
            <ArrowRightOnRectangleIcon
              title={"Logout"}
              className="w-5 h-5 text-primary-1"
            />
          </button>
        </div>
        <div className="w-full overflow-auto border-t border-l border-zinc-100 rounded-tl-md shadow">
          {children}
        </div>
      </div>
    </>
  )
}

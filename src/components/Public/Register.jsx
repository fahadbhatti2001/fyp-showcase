import React, { useState } from "react"
import { Spinner, UseUserAuth } from "@/components"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import Link from "next/link"

import { db } from "@/FirebaseConfig"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

export const Register = () => {
  const { signUp } = UseUserAuth()
  const router = useRouter()
  const { register, handleSubmit } = useForm()
  let [spin, setSpin] = useState(false)

  const onSignIn = async (data) => {
    try {
      setSpin(true)
      signUp(data.email, data.password).then(async function (response) {
        const inputDataCopy = { ...data }
        inputDataCopy.timestamp = serverTimestamp()
        inputDataCopy.role = "STUDENT"
        await setDoc(doc(db, "Users", response.user.uid), inputDataCopy)
        setSpin(false)
      })
      setSpin(false)
      Swal.fire({
        icon: "success",
        title: "Account Created Successfully!",
        toast: true,
        showCancelButton: false,
        animation: false,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        iconColor: "#000000",
      })
      router.push("/login")
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Wrong Credentials",
        toast: true,
        animation: true,
        position: "top",
        timer: 2000,
        iconColor: "#27272a",
        showCancelButton: false,
        showConfirmButton: false,
      })
    }
  }

  return (
    <>
      <Spinner isSpinner={spin}></Spinner>
      <div className="flex justify-center items-center h-[87vh] md:px-12 px-6">
        <div className="md:w-2/5 w-full flex flex-col justify-center items-center border md:border-zinc-200 border-white py-8 rounded-lg md:shadow-md shadow-none">
          <div className="lg:w-3/4 w-full">
            <h1 className="font-PoppinsSemiBold text-4xl text-zinc-800 pb-2 lg:text-left text-center">
              Sign Up
            </h1>
            <p className="font-PoppinsRegular text-xs text-zinc-800 pb-2 lg:text-left text-center">
              Enter your detail to register your account
            </p>
            <div className="flex flex-col pt-4">
              <label
                htmlFor="name"
                className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1"
              >
                Name
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                id="name"
                placeholder="Enter name"
                className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-1"
              />
              <label
                htmlFor="email"
                className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1"
              >
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="Enter email"
                className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-1"
              />
              <label
                htmlFor="password"
                className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1"
              >
                Password
              </label>
              <input
                {...register("password", { required: true })}
                type="password"
                id="password"
                placeholder="Enter password"
                className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-1"
              />
              <button
                onClick={handleSubmit(onSignIn)}
                type="button"
                className="font-PoppinsRegular text-base p-2 bg-primary-1 text-white rounded shadow-sm mt-2"
              >
                Register
              </button>
              <div className="flex justify-center py-2">
                <p className="font-PoppinsRegular text-xs text-zinc-800">
                  Already have an account?{" "}
                  <Link className="text-primary-1" href="/login">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

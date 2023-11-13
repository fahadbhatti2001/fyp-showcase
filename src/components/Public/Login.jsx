import React, { useState } from "react"
import { UseUserAuth } from "@/components"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/FirebaseConfig"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"

export const Login = () => {
  const { signIn, forgetPassword } = UseUserAuth()
  const router = useRouter()
  const { register, handleSubmit } = useForm()
  const [forgetEmail, setForgetEmail] = useState("")
  const [fotgetPassword, setForgetPassword] = useState(true)

  const onSignIn = async (data) => {
    try {
      const user = await signIn(data.email, data.password)
      const userDocRef = doc(db, "Users", user.user.uid)
      const userDocSnapshot = await getDoc(userDocRef)
      const userData = userDocSnapshot.data()
      const copyUserData = { ...userData }
      copyUserData.id = user.user.uid
      if (userData.role == "ADMIN") {
        router.push("/admin")
      } else if (userData.role == "STUDENT") {
        router.push("/dashboard")
      }
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

  const forgetHandleSubmit = async (e) => {
    e.preventDefault()
    try {
      await forgetPassword(forgetEmail)
      setForgetPassword(true)
      Swal.fire({
        icon: "success",
        title: "Password Reset Link Sent!",
        toast: true,
        showCancelButton: false,
        animation: false,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        iconColor: "#000000",
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Enter Registed Email!",
        toast: true,
        showCancelButton: false,
        animation: false,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        iconColor: "#000000",
      })
    }
  }

  return (
    <div className="flex justify-center items-center h-[87vh] md:px-12 px-6">
      <div className="md:w-2/5 w-full flex flex-col justify-center items-center border md:border-zinc-200 border-white py-8 rounded-lg md:shadow-md shadow-none">
        {fotgetPassword ? (
          <div className="lg:w-3/4 w-full">
            <h1 className="font-PoppinsSemiBold text-4xl text-zinc-800 pb-2 lg:text-left text-center">
              Login
            </h1>
            <p className="font-PoppinsRegular text-xs text-zinc-800 pb-2 lg:text-left text-center">
              Enter your credentials to access your account
            </p>
            <div className="flex flex-col pt-4">
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-1"
              />
              <div className="flex justify-end py-2">
                <button
                  onClick={() => setForgetPassword(false)}
                  className="font-PoppinsRegular text-xs text-primary-1"
                >
                  Forget Password
                </button>
              </div>
              <button
                onClick={handleSubmit(onSignIn)}
                type="button"
                className="font-PoppinsRegular text-base p-2 bg-primary-1 text-white rounded shadow-sm mt-2"
              >
                Login
              </button>
              <div className="flex justify-center py-2">
                <p className="font-PoppinsRegular text-xs text-zinc-800">
                  Don't have an account?{" "}
                  <Link className="text-primary-1" href="/register">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:w-3/4 w-full">
            <button
              onClick={() => setForgetPassword(true)}
              type="button"
              className="flex items-center gap-2 text-base text-primary-1 py-2"
            >
              <ArrowLeftCircleIcon className="w-5 h-5" />
              <p className="">Back to Login</p>
            </button>
            <h1 className="font-PoppinsSemiBold text-4xl text-zinc-800 pb-2 lg:text-left text-center">
              Forget Password
            </h1>
            <p className="font-PoppinsRegular text-xs text-zinc-800 pb-2 lg:text-left text-center">
              Enter your email to reset your password
            </p>
            <div className="flex flex-col pt-4">
              <div className="flex flex-col pt-4">
                <label
                  htmlFor="email"
                  className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1"
                >
                  Email
                </label>
                <input
                  onChange={(e) => {
                    setForgetEmail(e.target.value)
                  }}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-0"
                />
                <button
                  type="button"
                  onClick={forgetHandleSubmit}
                  className="font-PoppinsRegular text-base p-2 bg-primary-1 text-white rounded shadow-sm mt-2"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

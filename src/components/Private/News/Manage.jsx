import { db } from "@/FirebaseConfig"
import { UseUserAuth } from "@/components"
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"

export const ManageNews = () => {
  const newsRef = collection(db, "News")

  const { user } = UseUserAuth()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const getData = async () => {
    const projectsData = await getDocs(newsRef)
    const allNews = projectsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    setValue("text", allNews[0].text)
  }

  useEffect(() => {
    if (user) {
      if (user.uid) {
        getData()
      }
    }
  }, [user])

  const onUpdate = async (inputDataCopy) => {
    try {
      const projectDoc = doc(db, "News", "haR72BUhs8MGBiy1ZzcD")
      await updateDoc(projectDoc, inputDataCopy)

      Swal.fire({
        icon: "success",
        title: "News Updated!",
        toast: true,
        animation: true,
        position: "top",
        timer: 2000,
        iconColor: "#27272a",
        showCancelButton: false,
        showConfirmButton: false,
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Update News",
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
    <div className="p-4">
      <div className="w-full">
        <label htmlFor="text" className="text-sm">
          News
        </label>
        <textarea
          type="text"
          {...register("text", { required: true })}
          placeholder="Enter News"
          id="text"
          className={
            (errors.text
              ? "placeholder:text-red-400 border-red-400"
              : "border-gray-300 placeholder:text-zinc-400") +
            " resize-none h-40 mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
          }
        />
      </div>
      <div className="lg:col-span-6 col-span-3 w-full flex justify-end">
        <button
          type="button"
          onClick={handleSubmit(onUpdate)}
          className="py-2 px-4 hover:text-primary-1 text-white hover:bg-transparent bg-primary-1 2xl:text-base lg:text-xs text-sm border border-primary-1 rounded"
        >
          Update
        </button>
      </div>
    </div>
  )
}

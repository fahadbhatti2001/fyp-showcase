import { db } from "@/FirebaseConfig"
import { collection, getDocs } from "firebase/firestore"
import React, { useEffect, useState } from "react"

export const News = () => {
  const [news, setNews] = useState("")
  const newsRef = collection(db, "News")

  const getData = async () => {
    const projectsData = await getDocs(newsRef)
    const allNews = projectsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    setNews(allNews[0].text)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900 text-center">
          News
        </h1>
        <div className="flex my-6 justify-center">
          <div className="w-16 h-1 rounded-full bg-primary-1 inline-flex"></div>
        </div>
        <div className="flex justify-center">
          <p className="leading-relaxed text-lg text-center md:w-1/2 w-full">{news}</p>
        </div>
      </div>
    </section>
  )
}

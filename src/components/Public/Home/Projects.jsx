import React, { useEffect, useState } from "react"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/FirebaseConfig"

export const Projects = () => {
  let [data, setData] = useState([])
  const projectsRef = collection(db, "Projects")

  const getData = async () => {
    const projectsData = await getDocs(projectsRef)
    const allProjects = projectsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    setData(allProjects)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
            Latest Projects
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
            Tailored products designed for every aspect of your teams' needs.
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-primary-1 inline-flex"></div>
          </div>
        </div>
        <div className="-my-8 divide-y-2 divide-gray-100">
          {data.map((e, i) =>
            i < 3 ? (
              <div className="py-8 flex flex-wrap md:flex-nowrap">
                <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                  <span className="font-semibold title-font text-gray-700">
                    Program
                  </span>
                  <span className="mt-1 text-gray-500 text-sm">
                    {e.program}
                  </span>
                </div>
                <div className="md:flex-grow">
                  <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                    {e.projectTitle}
                  </h2>
                  <p className="leading-relaxed">{e.summary}</p>
                  <Link
                    href={`/project?id=${e.id}`}
                    className="text-primary-1 flex gap-2 hover:gap-3 transition-all ease-in-out duration-75 items-center mt-4"
                  >
                    Learn More
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : null,
          )}
        </div>
        <button class="flex mx-auto mt-16 text-white bg-primary-1 border-0 py-2 px-8 focus:outline-none hover:bg-opacity-90 rounded text-lg">
          <Link href="/projects">View All</Link>
        </button>
      </div>
    </section>
  )
}

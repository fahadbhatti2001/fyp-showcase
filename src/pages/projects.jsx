import React, { useEffect, useState } from "react"
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/FirebaseConfig"
import { Footer, Navbar } from "@/components"

export default function Projects() {
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

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const [searchQuery, setSearchQuery] = useState("")

  const filtered =
    data.length == 0
      ? []
      : currentData.filter((project) => {
          const query = searchQuery.toLowerCase()
          return (
            project.projectTitle.toLowerCase().includes(query) ||
            project.department.toLowerCase().includes(query) ||
            project.program.toLowerCase().includes(query) ||
            project.session.toLowerCase().includes(query)
          )
        })

  return (
    <div className="flex flex-col items-center w-full">
      <div className="container">
        <Navbar />
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
                Latest Projects
              </h1>
              <div className="flex flex-col items-center mt-4">
                <div className="md:w-2/3 w-full border flex items-center gap-2 p-2 rounded-full">
                  <MagnifyingGlassIcon className="w-6 h-6" />
                  <input
                    className="outline-none w-full"
                    type="text"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="md:w-2/3 w-full grid md:grid-cols-3 grid-cols-1 md:gap-4 gap-1 px-2 md:py-4 p-2">
                  <select
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="outline-none w-full bg-transparent"
                  >
                    <option className="text-zinc-700" value="">
                      Select Department
                    </option>
                    <option
                      className="text-zinc-700"
                      value="Electrical Engineering Department"
                    >
                      Electrical Engineering Department
                    </option>
                    <option
                      className="text-zinc-700"
                      value="Civil Engineering Department"
                    >
                      Civil Engineering Department
                    </option>
                  </select>
                  <select
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="outline-none w-full bg-transparent"
                  >
                    <option className="text-zinc-700" value="">
                      Select Program
                    </option>
                    <option
                      className="text-zinc-700"
                      value="DIPLOMA IN ELECTRICAL ENGINEERING"
                    >
                      DIPLOMA IN ELECTRICAL ENGINEERING
                    </option>
                    <option
                      className="text-zinc-700"
                      value="DIPLOMA IN ELECTRONIC ENGINEERING (COMMUNICATION)"
                    >
                      DIPLOMA IN ELECTRONIC ENGINEERING (COMMUNICATION)
                    </option>
                    <option
                      className="text-zinc-700"
                      value="DIPLOMA IN ELECTRICAL AND ELECTRONIC ENGINEERING"
                    >
                      DIPLOMA IN ELECTRICAL AND ELECTRONIC ENGINEERING
                    </option>
                  </select>
                  <select
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="outline-none w-full bg-transparent"
                  >
                    <option className="text-zinc-700" value="">
                      Select Session
                    </option>
                    <option className="text-zinc-700" value="2022/2023">
                      2022/2023
                    </option>
                    <option className="text-zinc-700" value="2023/2024">
                      2023/2024
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex mt-6 justify-center">
                <div className="w-16 h-1 rounded-full bg-primary-1 inline-flex"></div>
              </div>
            </div>
            <div className="-my-8 divide-y-2 divide-gray-100">
              {filtered.map((e, i) =>
                e.status == "Approved" ? (
                  <div className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col gap-4">
                      <span className="font-semibold title-font text-gray-700">
                        Program
                      </span>
                      <span className="mt-1 text-gray-500 text-sm text-ellipsis overflow-hidden whitespace-nowrap md:w-4/5 w-full">
                        {e.program}
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                        {e.projectTitle}
                      </h2>
                      <p className="leading-relaxed text-wrap">{e.summary}</p>
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
            <div className="flex justify-center items-center py-8 gap-2">
              <button
                className="text-primary-4 w-8 h-8 bg-primary-1 rounded-full flex justify-center items-center"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              <span className="text-primary-1">{currentPage}</span>
              <button
                className="text-primary-4 w-8 h-8 bg-primary-1 rounded-full flex justify-center items-center"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}

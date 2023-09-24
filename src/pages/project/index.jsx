import React, { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/FirebaseConfig"
import { Footer, Navbar } from "@/components"
import { useRouter } from "next/router"

export default function Project() {
  let [project, setProject] = useState({
    projectTitle: "",
    summary: "",
    costEst: "",
    session: "",
    course: "",
    projectSupervisor: "",
    department: "",
    program: "",
    leader: "",
    problemStatement: "",
    projectObjective: "",
    problemScope: "",
    proposal: "",
    investigation: "",
    report: "",
    youtube: "",
    group: [],
    achivements: [],
    images: [],
  })
  const projectsRef = collection(db, "Projects")

  const router = useRouter()

  const getData = async () => {
    const projectsData = await getDocs(projectsRef)
    const allProjects = projectsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    const specificProjectData = allProjects.filter(
      (x) => x.id == router.query.id,
    )
    setProject(specificProjectData[0])
  }

  useEffect(() => {
    getData()
  }, [router.query.id])

  return (
    <div className="flex flex-col items-center w-full">
      <div className="container">
        <Navbar />
        <div className="flex flex-col gap-2 w-full p-4">
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Project Title:
            </p>
            <p className="col-span-5 text-zinc-500">{project.projectTitle}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Project Summary/Abstract:
            </p>
            <p className="col-span-5 text-zinc-500">{project.summary}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Project Cost Estimation:
            </p>
            <p className="col-span-5 text-zinc-500">RM {project.costEst}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Session:</p>
            <p className="col-span-5 text-zinc-500">{project.session}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Course:</p>
            <p className="col-span-5 text-zinc-500">{project.course}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Project Supervisor:
            </p>
            <p className="col-span-5 text-zinc-500">
              {project.projectSupervisor}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Department:</p>
            <p className="col-span-5 text-zinc-500">{project.department}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Program:</p>
            <p className="col-span-5 text-zinc-500">{project.program}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Leader:</p>
            <p className="col-span-5 text-zinc-500">{project.leader}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Group Members:
            </p>
            <p className="col-span-5 text-zinc-500">
              {project.group.map((e, i) => (
                <span className="block">
                  {i + 1}. {e}
                </span>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Problem Statement:
            </p>
            <p className="col-span-5 text-zinc-500">
              {project.problemStatement}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Project Objective:
            </p>
            <p className="col-span-5 text-zinc-500">
              {project.projectObjective}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Project Scope:
            </p>
            <p className="col-span-5 text-zinc-500">{project.problemScope}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Group Members:
            </p>
            <p className="col-span-5 text-zinc-500">
              {project.achivements.map((e, i) => (
                <span className="block">
                  {i + 1}. {e}
                </span>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Proposal:</p>
            <Link href={project.proposal} className="col-span-5 text-primary-1">
              Download
            </Link>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Investigation Report:
            </p>
            <Link
              href={project.investigation}
              className="col-span-5 text-primary-1"
            >
              Download
            </Link>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">
              Final Report:
            </p>
            <Link href={project.report} className="col-span-5 text-primary-1">
              Download
            </Link>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Youtube:</p>
            <p className="col-span-5 text-zinc-500">{project.youtube}</p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="col-span-1 font-medium text-zinc-700">Images:</p>
            <div className="col-span-5">
              {project.images.map((e, i) => (
                <div key={i} className="w-full">
                  <img src={e} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

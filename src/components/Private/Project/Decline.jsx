import React, { useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { db, storage } from "@/FirebaseConfig"
import { Spinner, UseUserAuth } from "@/components"
import Swal from "sweetalert2"
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline"
import { produce } from "immer"
import Link from "next/link"
import { deleteObject, ref } from "firebase/storage"

export const Decline = () => {
  let [data, setData] = useState([])
  const projectsRef = collection(db, "Projects")

  const [isRead, setIsRead] = useState(false)
  const [spin, setSpin] = useState(false)

  const [project, setProject] = useState({})

  const { user } = UseUserAuth()

  const getData = async () => {
    const projectsData = await getDocs(projectsRef)
    const allProjects = projectsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    setData(allProjects)
  }

  useEffect(() => {
    if (user) {
      if (user.uid) {
        getData()
      }
    }
  }, [user])

  const onDelete = async (dataa) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF6D35",
        cancelButtonColor: "#d33333",
        confirmButtonText: "Yes, Delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSpin(true)
          const projectDoc = doc(db, "Projects", dataa.id)
          for (const [i, file] of dataa.images.entries()) {
            const deleteImage = ref(storage, file)
            await deleteObject(deleteImage)
          }
          const deleteProposal = ref(storage, dataa.proposal)
          const deleteInvestigation = ref(storage, dataa.investigation)
          const deleteReport = ref(storage, dataa.report)
          await deleteDoc(projectDoc)
          await deleteObject(deleteProposal)
          await deleteObject(deleteInvestigation)
          await deleteObject(deleteReport)
          const newData = data.filter((e) => e.id != dataa.id)
          setData(newData)
          setSpin(false)
          Swal.fire({
            icon: "success",
            title: "Project Deleted!",
            toast: true,
            animation: true,
            position: "top",
            timer: 2000,
            iconColor: "#27272a",
            showCancelButton: false,
            showConfirmButton: false,
          })
        }
      })
    } catch (error) {
      setSpin(false)
      Swal.fire({
        icon: "error",
        title: "Unable to delete project!",
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

  const onRead = (data) => {
    setProject(data)
    setIsRead(true)
  }

  const onUpdate = async (data, status) => {
    try {
      const inputDataCopy = { ...data }
      inputDataCopy.status = status

      const projectDoc = doc(db, "Projects", data.id)
      await updateDoc(projectDoc, inputDataCopy)

      setData(
        produce((draft) => {
          let projectData = draft.find(
            (projectData) => projectData.id === data.id,
          )
          projectData.status = inputDataCopy.status
        }),
      )
      Swal.fire({
        icon: "success",
        title: "Status Updated!",
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
        title: "Unable to Update Status",
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
      {isRead ? (
        <div className="flex flex-col gap-2 w-full dashboard-height overflow-auto p-4">
          <button
            className="text-primary-1 flex items-center gap-2 text-sm"
            onClick={() => setIsRead(false)}
            type="button"
          >
            <ArrowLeftCircleIcon className="w-4 h-4" /> Back
          </button>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Video:
            </p>
            <div className="md:col-span-5 col-span-6 text-zinc-500">
              <iframe
                className="lg:w-1/2 w-full lg:h-96 h-40"
                src={project.youtube}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Project Title:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.projectTitle}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Project Summary/Abstract:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.summary}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Project Cost Estimation:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              RM {project.costEst}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Session:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.session}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Course:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.course}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Project Supervisor:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.projectSupervisor}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Department:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.department}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Program:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.program}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Leader:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.leader}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Group Members:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.group.map((e, i) => (
                <span className="block">
                  {i + 1}. {e}
                </span>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Problem Statement:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.problemStatement}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Project Objective:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.projectObjective}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Project Scope:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.problemScope}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Group Members:
            </p>
            <p className="md:col-span-5 col-span-6 text-zinc-500">
              {project.achivements.map((e, i) => (
                <span className="block">
                  {i + 1}. {e}
                </span>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Proposal:
            </p>
            <Link href={project.proposal} className="col-span-5 text-primary-1">
              Download
            </Link>
          </div>
          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
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
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Final Report:
            </p>
            <Link href={project.report} className="col-span-5 text-primary-1">
              Download
            </Link>
          </div>

          <div className="grid grid-cols-6 gap-4 w-full">
            <p className="md:col-span-1 col-span-6 font-medium text-zinc-700">
              Images:
            </p>
            <div className="col-span-5">
              {project.images.map((e, i) => (
                <div key={i} className="w-full">
                  <img src={e} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full gap-2 p-4">
          {data.map((e, i) =>
            e.status == "Declined" ? (
              <div
                key={i}
                className="border border-primary-1/50 rounded-md shadow flex flex-col justify-between"
              >
                <div className="col-span-1 bg-white/5 w-full flex flex-col border-b border-zinc-100 gap-2 2xl:p-4 p-2 2xl:rounded-t-xl rounded-t h-40">
                  <div className="flex justify-end">
                    <p className="text-xs border border-black px-2 py-px rounded-full">
                      {e.status}
                    </p>
                  </div>
                  <h1 className="text-zinc-700 text-ellipsis whitespace-nowrap w-full overflow-hidden">
                    {e.projectTitle}
                  </h1>
                  <p className="text-sm text-zinc-400 text-wrap">{e.summary}</p>
                </div>
                <div className="grid grid-cols-4 bg-white/5 2xl:rounded-b-xl rounded-b">
                  <button
                    onClick={() => {
                      onRead(e)
                    }}
                    className="2xl:text-base text-sm text-center text-primary-1 py-2 border-r border-zinc-100 w-full"
                    type="button"
                  >
                    Read
                  </button>
                  <button
                    onClick={() => onUpdate(e, "Approved")}
                    className="2xl:text-base text-sm text-center text-primary-1 py-2 border-l border-zinc-100"
                    type="button"
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => onUpdate(e, "Pending Approval")}
                    className="2xl:text-base text-sm text-center text-primary-1 py-2 border-l border-zinc-100"
                    type="button"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => onDelete(e)}
                    className="2xl:text-base text-sm text-center text-primary-1 py-2 border-l border-zinc-100"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : null,
          )}
        </div>
      )}
    </>
  )
}

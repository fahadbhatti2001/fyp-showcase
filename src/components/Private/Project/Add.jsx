import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { db, storage } from "@/FirebaseConfig"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Chips, Spinner, UseUserAuth } from "@/components"
import Swal from "sweetalert2"
import { CameraIcon, XCircleIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

export const Add = () => {
  const { user } = UseUserAuth()

  const [group, setGroup] = useState([])
  const [achivements, setAchivements] = useState([])

  let imageName = new Date().getTime()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  let [spin, setSpin] = useState(false)

  const [images, setImages] = useState([])

  const [proposal, setProposal] = useState({})
  const [investigation, setInvestigation] = useState({})
  const [report, setReport] = useState({})

  const [showImages, setShowImages] = useState([])

  const handleImage = async (event) => {
    if (event.target.files && event.target.files[0]) {
      setImages([...images, event.target.files[0]])
      setShowImages([...showImages, URL.createObjectURL(event.target.files[0])])
    }
  }

  const removeImage = (indexToRemove) => {
    setShowImages([...showImages.filter((_, index) => index !== indexToRemove)])
    setImages([...images.filter((_, index) => index !== indexToRemove)])
  }

  const onSubmit = async (data) => {
    try {
      setSpin(true)
      const urls = []
      for (const [i, file] of images.entries()) {
        const imageRef = ref(storage, `images/${imageName + i}`)
        const snapshot = await uploadBytes(imageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        urls.push(downloadURL)
      }

      const proposalRef = ref(storage, `files/${proposal.name}`)
      const snapshotProposal = await uploadBytes(proposalRef, proposal)
      const downloadProposalURL = await getDownloadURL(snapshotProposal.ref)

      const investigationRef = ref(storage, `files/${investigation.name}`)
      const snapshotInvestigation = await uploadBytes(
        investigationRef,
        investigation,
      )
      const downloadInvestigationURL = await getDownloadURL(
        snapshotInvestigation.ref,
      )

      const reportRef = ref(storage, `files/${report.name}`)
      const snapshotReport = await uploadBytes(reportRef, report)
      const downloadReportURL = await getDownloadURL(snapshotReport.ref)

      const inputDataCopy = { ...data }
      inputDataCopy.timestamp = serverTimestamp()
      inputDataCopy.status = "Pending Approval"
      inputDataCopy.images = urls
      inputDataCopy.achivements = achivements
      inputDataCopy.group = group
      inputDataCopy.userID = user.uid

      inputDataCopy.proposal = downloadProposalURL
      inputDataCopy.investigation = downloadInvestigationURL
      inputDataCopy.report = downloadReportURL

      await addDoc(collection(db, "Projects"), inputDataCopy)
      reset({
        projectTitle: "",
        projectSupervisor: "",
        department: "",
        program: "",
        session: "",
        course: "",
        costEst: "",
        youtube: "",
        leader: "",
        summary: "",
        problemScope: "",
        problemStatement: "",
        projectObjective: "",
      })
      setImages([])
      setProposal({})
      setInvestigation({})
      setReport({})
      setShowImages([])
      setSpin(false)
      Swal.fire({
        icon: "success",
        title: "Project Added!",
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
        title: "Unable to Add Project",
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
      <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 lg:gap-4 gap-2 dashboard-height overflow-auto p-4">
        <fieldset className="lg:col-span-6 md:col-span-4 col-span-2 w-full">
          <label htmlFor="images" className="text-sm">
            Add Images
          </label>
          <input
            id="images"
            type="file"
            className="hidden"
            onChange={(e) => handleImage(e)}
            accept="image/png, image/jpg, image/jpeg"
          />
          <div className="flex flex-wrap gap-2 relative z-0">
            {showImages.map((e, i) => (
              <div key={i} className="relative">
                <button
                  className="absolute right-1 top-1 z-10"
                  onClick={() => removeImage(i)}
                  title="Close"
                >
                  <XCircleIcon className="h-5 w-5 stroke-2  stroke-red-500 rounded-full" />
                </button>
                <Image
                  src={e}
                  className="md:h-40 h-24 md:w-40 w-24 object-contain rounded border border-primary-1 bg-white/5 backdrop-blur-sm relative"
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
            ))}
            {showImages.length <= 7 && (
              <label
                className="col-span-1 md:h-40 h-24 md:w-40 w-24 flex justify-center items-center rounded border border-primary-1 text-gray-400 hover:text-red-500 cursor-pointer"
                htmlFor="images"
              >
                <CameraIcon className="h-8 w-8 stroke-primary-1" />
              </label>
            )}
          </div>
        </fieldset>
        <div className="col-span-2 w-full">
          <label htmlFor="projectTitle" className="text-sm">
            Project Title
          </label>
          <input
            type="text"
            {...register("projectTitle", { required: true })}
            placeholder="Enter Project Title"
            id="projectTitle"
            className={
              (errors.projectTitle
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="projectSupervisor" className="text-sm">
            Project Supervisor
          </label>
          <input
            type="text"
            {...register("projectSupervisor", { required: true })}
            placeholder="Enter Project Supervisor"
            id="projectSupervisor"
            className={
              (errors.projectSupervisor
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="department" className="text-sm">
            Department
          </label>
          <input
            type="text"
            {...register("department", { required: true })}
            placeholder="Enter Department"
            id="department"
            className={
              (errors.department
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="program" className="text-sm">
            Program
          </label>
          <input
            type="text"
            {...register("program", { required: true })}
            placeholder="Enter Program"
            id="program"
            className={
              (errors.program
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="session" className="text-sm">
            Session
          </label>
          <input
            type="text"
            {...register("session", { required: true })}
            placeholder="Enter Session"
            id="session"
            className={
              (errors.session
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="course" className="text-sm">
            Course
          </label>
          <input
            type="text"
            {...register("course", { required: true })}
            placeholder="Enter Course"
            id="course"
            className={
              (errors.course
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full flex flex-col gap-1">
          <label htmlFor="proposal" className="text-sm">
            Proposal
          </label>
          <label
            htmlFor="proposal"
            className="mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1 text-zinc-400 cursor-pointer"
          >
            {proposal.name == undefined ? (
              <p>
                Submit Proposal{" "}
                <span className="text-xs">(DOC, DOCX, PDF)</span>
              </p>
            ) : (
              <p className="">{proposal.name}</p>
            )}
          </label>
          <input
            type="file"
            id="proposal"
            className="hidden"
            onChange={(e) => setProposal(e.target.files[0])}
            accept="doc, .docx, .pdf"
          />
        </div>
        <div className="col-span-2 w-full flex flex-col gap-1">
          <label htmlFor="investigation" className="text-sm">
            Investigation Report
          </label>
          <label
            htmlFor="investigation"
            className="mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1 text-zinc-400 cursor-pointer"
          >
            {investigation.name == undefined ? (
              <p>
                Submit Investigation Report{" "}
                <span className="text-xs">(DOC, DOCX, PDF)</span>
              </p>
            ) : (
              <p className="">{investigation.name}</p>
            )}
          </label>
          <input
            type="file"
            id="investigation"
            className="hidden"
            onChange={(e) => setInvestigation(e.target.files[0])}
            accept="doc, .docx, .pdf"
          />
        </div>
        <div className="col-span-2 w-full flex flex-col gap-1">
          <label htmlFor="final" className="text-sm">
            Final Report
          </label>
          <label
            htmlFor="final"
            className="mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1 text-zinc-400 cursor-pointer"
          >
            {report.name == undefined ? (
              <p>
                Submit Final Report{" "}
                <span className="text-xs">(DOC, DOCX, PDF)</span>
              </p>
            ) : (
              <p className="">{report.name}</p>
            )}
          </label>
          <input
            type="file"
            id="final"
            className="hidden"
            onChange={(e) => setReport(e.target.files[0])}
            accept="doc, .docx, .pdf"
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="costEst" className="text-sm">
            Cost Estimation
          </label>
          <input
            type="number"
            {...register("costEst", { required: true })}
            placeholder="Enter Cost Estimation"
            id="costEst"
            className={
              (errors.program
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="youtube" className="text-sm">
            Youtube Link
          </label>
          <input
            type="text"
            {...register("youtube", { required: true })}
            placeholder="Enter Youtube Link"
            id="youtube"
            className={
              (errors.youtube
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="col-span-2 w-full">
          <label htmlFor="leader" className="text-sm">
            Leader Name
          </label>
          <input
            type="text"
            {...register("leader", { required: true })}
            placeholder="Enter Leader Name"
            id="leader"
            className={
              (errors.leader
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <Chips
          className="lg:col-span-3 col-span-2 w-full"
          label="Group Members"
          placeholder="Add and hit enter"
          previousChips={group}
          setchip={setGroup}
        />
        <Chips
          className="lg:col-span-3 col-span-2 w-full"
          label="Achievements"
          placeholder="Add and hit enter"
          previousChips={achivements}
          setchip={setAchivements}
        />
        <div className="lg:col-span-3 col-span-2 w-full">
          <label htmlFor="summary" className="text-sm">
            Project Summary/Abstract
          </label>
          <textarea
            type="text"
            {...register("summary", { required: true })}
            placeholder="Enter Summary/Abstract"
            id="summary"
            className={
              (errors.summary
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " resize-none h-40 mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="lg:col-span-3 col-span-2 w-full">
          <label htmlFor="problemStatement" className="text-sm">
            Problem Statement
          </label>
          <textarea
            type="text"
            {...register("problemStatement", { required: true })}
            placeholder="Enter Problem Statement"
            id="problemStatement"
            className={
              (errors.problemStatement
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " resize-none h-40 mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="lg:col-span-3 col-span-2 w-full">
          <label htmlFor="projectObjective" className="text-sm">
            Project Objective
          </label>
          <textarea
            type="text"
            {...register("projectObjective", { required: true })}
            placeholder="Enter Project Objective"
            id="projectObjective"
            className={
              (errors.projectObjective
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " resize-none h-40 mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="lg:col-span-3 col-span-2 w-full">
          <label htmlFor="problemScope" className="text-sm">
            Problem Scope
          </label>
          <textarea
            type="text"
            {...register("problemScope", { required: true })}
            placeholder="Enter Problem Scope"
            id="problemScope"
            className={
              (errors.problemScope
                ? "placeholder:text-red-400 border-red-400"
                : "border-gray-300 placeholder:text-zinc-400") +
              " resize-none h-40 mt-1 rounded shadow outline-none py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
            }
          />
        </div>
        <div className="lg:col-span-6 col-span-3 w-full flex justify-end">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="py-2 px-4 hover:text-primary-1 text-white hover:bg-transparent bg-primary-1 2xl:text-base lg:text-xs text-sm border border-primary-1 rounded"
          >
            Add Project
          </button>
        </div>
      </div>
    </>
  )
}

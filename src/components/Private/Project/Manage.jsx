import React, { useEffect, useState } from "react"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/FirebaseConfig"
import { Chips, Spinner, UseUserAuth } from "@/components"
import Swal from "sweetalert2"
import { useForm } from "react-hook-form"
import {
  ArrowLeftCircleIcon,
  CameraIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import { produce } from "immer"
import Link from "next/link"
import { api } from "@/api"

export const Manage = () => {
  let [data, setData] = useState([])
  const projectsRef = collection(db, "Projects")

  const [project, setProject] = useState({})

  const [isEdit, setIsEdit] = useState(false)
  const [isRead, setIsRead] = useState(false)
  const [spin, setSpin] = useState(false)

  const { user } = UseUserAuth()

  const getData = async () => {
    const projectsData = await getDocs(projectsRef)
    const allProjects = projectsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    const specificUserData = allProjects.filter((x) => x.userID == user.uid)
    setData(specificUserData)
  }

  useEffect(() => {
    if (user) {
      if (user.uid) {
        getData()
      }
    }
  }, [user])

  const [group, setGroup] = useState([])
  const [achivements, setAchivements] = useState([])

  let imageName = new Date().getTime()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const [images, setImages] = useState([])
  const [showImages, setShowImages] = useState([])
  const [proposal, setProposal] = useState({})
  const [investigation, setInvestigation] = useState({})
  const [report, setReport] = useState({})

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
            api.UploadApi.Delete(file)
          }
          api.UploadApi.Delete(dataa.proposal)
          api.UploadApi.Delete(dataa.investigation)
          api.UploadApi.Delete(dataa.report)
          await deleteDoc(projectDoc)
          console.log(data)
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

  const onEdit = (data) => {
    setImages(data.images)
    setShowImages(data.images)
    setAchivements(data.achivements)
    setGroup(data.group)
    setProposal(data.proposal)
    setInvestigation(data.investigation)
    setReport(data.report)
    setValue("id", data.id)
    setValue("projectTitle", data.projectTitle)
    setValue("projectSupervisor", data.projectSupervisor)
    setValue("department", data.department)
    setValue("program", data.program)
    setValue("session", data.session)
    setValue("course", data.course)
    setValue("costEst", data.costEst)
    setValue("youtube", data.youtube)
    setValue("leader", data.leader)
    setValue("summary", data.summary)
    setValue("problemScope", data.problemScope)
    setValue("problemStatement", data.problemStatement)
    setValue("projectObjective", data.projectObjective)
    setIsEdit(true)
  }

  const onSubmit = async (dataa) => {
    try {
      setSpin(true)
      const urls = []
      for (const [i, file] of images.entries()) {
        if (typeof file === "string") {
          urls.push(file)
        } else {
          const formData = new FormData()
          const renamedFile = new File(
            [file],
            `${i + imageName}_${file.name.replaceAll(" ", "_")}`,
            { type: file.type },
          )
          formData.append("fileToUpload", renamedFile)
          api.UploadApi.Upload(formData)
          urls.push(
            `${process.env.NEXT_PUBLIC_API_BASE}/uploads/${
              i + imageName
            }_${file.name.replaceAll(" ", "_")}`,
          )
        }
      }

      let formDataProposal = new FormData()
      if (typeof proposal !== "string") {
        const renamedFileProposal = new File(
          [proposal],
          `${imageName}_${proposal.name.replaceAll(" ", "_")}`,
          { type: proposal.type },
        )
        formDataProposal.append("fileToUpload", renamedFileProposal)
        api.UploadApi.Upload(formDataProposal)
      } else {
        formDataProposal = proposal
      }

      let formDataInvestigation = new FormData()
      if (typeof investigation !== "string") {
        const renamedFileInvestigation = new File(
          [investigation],
          `${imageName}_${investigation.name.replaceAll(" ", "_")}`,
          { type: investigation.type },
        )
        formDataInvestigation.append("fileToUpload", renamedFileInvestigation)
        api.UploadApi.Upload(formDataInvestigation)
      } else {
        formDataInvestigation = investigation
      }

      let formDataReport = new FormData()
      if (typeof report !== "string") {
        const renamedFileReport = new File(
          [report],
          `${imageName}_${report.name.replaceAll(" ", "_")}`,
          { type: report.type },
        )
        formDataReport.append("fileToUpload", renamedFileReport)
        api.UploadApi.Upload(formDataReport)
      } else {
        formDataReport = report
      }

      const inputDataCopy = { ...dataa }
      inputDataCopy.timestamp = serverTimestamp()
      inputDataCopy.status = "Pending Approval"
      inputDataCopy.images = urls
      inputDataCopy.achivements = achivements
      inputDataCopy.group = group
      inputDataCopy.userID = user.uid

      if (typeof proposal === "string") {
        inputDataCopy.proposal = formDataProposal
      } else {
        inputDataCopy.proposal = `${
          process.env.NEXT_PUBLIC_API_BASE
        }/uploads/${imageName}_${proposal.name.replaceAll(" ", "_")}`
      }

      if (typeof investigation === "string") {
        inputDataCopy.investigation = formDataInvestigation
      } else {
        inputDataCopy.investigation = `${
          process.env.NEXT_PUBLIC_API_BASE
        }/uploads/${imageName}_${investigation.name.replaceAll(" ", "_")}`
      }

      if (typeof report === "string") {
        inputDataCopy.report = formDataReport
      } else {
        inputDataCopy.report = `${
          process.env.NEXT_PUBLIC_API_BASE
        }/uploads/${imageName}_${report.name.replaceAll(" ", "_")}`
      }

      const projectDoc = doc(db, "Projects", dataa.id)
      await updateDoc(projectDoc, inputDataCopy)

      formDataProposal = ""
      formDataInvestigation = ""
      formDataReport = ""

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
      setIsEdit(false)
      setData(
        produce((draft) => {
          let projectData = draft.find(
            (projectData) => projectData.id === dataa.id,
          )
          projectData.proposal = inputDataCopy.proposal
          projectData.investigation = inputDataCopy.investigation
          projectData.report = inputDataCopy.report
          projectData.projectTitle = inputDataCopy.projectTitle
          projectData.projectSupervisor = inputDataCopy.projectSupervisor
          projectData.department = inputDataCopy.department
          projectData.program = inputDataCopy.program
          projectData.session = inputDataCopy.session
          projectData.course = inputDataCopy.course
          projectData.costEst = inputDataCopy.costEst
          projectData.youtube = inputDataCopy.youtube
          projectData.leader = inputDataCopy.leader
          projectData.summary = inputDataCopy.summary
          projectData.problemScope = inputDataCopy.problemScope
          projectData.problemStatement = inputDataCopy.problemStatement
          projectData.projectObjective = inputDataCopy.projectObjective
          projectData.group = inputDataCopy.group
          projectData.achivements = inputDataCopy.achivements
          projectData.timestamp.seconds = imageName
          projectData.images = inputDataCopy.images
        }),
      )
      Swal.fire({
        icon: "success",
        title: "Project Updated!",
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
        title: "Unable to Update Project",
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

  return (
    <>
      <Spinner isSpinner={spin}></Spinner>
      {isEdit ? (
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 lg:gap-4 gap-2 dashboard-height overflow-auto p-4">
          <button
            className="text-primary-1 flex items-center gap-2 text-sm"
            onClick={() => setIsEdit(false)}
            type="button"
          >
            <ArrowLeftCircleIcon className="w-4 h-4" /> Back
          </button>
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
                  <img
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
          <div className="col-span-2 w-full">
            <label htmlFor="department" className="text-sm">
              Department
            </label>
            <select
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
            >
              <option className="text-zinc-700" value="" hidden>
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
          </div>
          <div className="col-span-2 w-full">
            <label htmlFor="program" className="text-sm">
              Program
            </label>
            <select
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
            >
              <option className="text-zinc-700" value="" hidden>
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
          </div>
          <div className="col-span-2 w-full">
            <label htmlFor="session" className="text-sm">
              Session
            </label>
            <select
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
            >
              <option className="text-zinc-700" value="" hidden>
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
              Project Scope
            </label>
            <textarea
              type="text"
              {...register("problemScope", { required: true })}
              placeholder="Enter Project Scope"
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
              Update Project
            </button>
          </div>
        </div>
      ) : isRead ? (
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
          {data.map((e, i) => (
            <div
              key={i}
              className="border border-primary-1/50 rounded-md shadow"
            >
              <div className="col-span-1 bg-white/5 w-full flex flex-col border-b border-zinc-100 gap-2 2xl:p-4 p-2 2xl:rounded-t-xl rounded-t">
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
              <div className="grid grid-cols-3 bg-white/5 2xl:rounded-b-xl rounded-b">
                <button
                  onClick={() => onRead(e)}
                  className="2xl:text-base text-sm text-center text-primary-1 py-2 border-r border-zinc-100"
                  type="button"
                >
                  Read
                </button>
                <button
                  onClick={() => onEdit(e)}
                  className="2xl:text-base text-sm text-center text-primary-1 py-2 border-r border-zinc-100"
                  type="button"
                  disabled={e.status == "Approved" ? true : false}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(e)}
                  className="2xl:text-base text-sm text-center text-primary-1 py-2 border-l border-zinc-100"
                  type="button"
                  disabled={e.status == "Approved" ? true : false}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

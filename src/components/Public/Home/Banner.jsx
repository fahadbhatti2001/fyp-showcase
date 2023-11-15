import React from "react"

export const Banner = () => {
  return (
    <section className="text-gray-600">
      <div className="mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            JKE Final Year Project
          </h1>
          <p className="mb-8 leading-relaxed">
            This website aims to provide a platform for JKE students to share
            their scientific research with others in an effort to further expand
            knowledge. Knowledge plays a crucial role in the development of
            current technology and can contribute to the progress of the nation.
            The process of seeking and transferring new knowledge, especially in
            the field of TVET, must continue to take place among all members of
            the polytechnic community.
          </p>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:block hidden">
          <img
            className="object-cover object-center rounded"
            src="/images/vector.jpg"
          />
        </div>
      </div>
    </section>
  )
}

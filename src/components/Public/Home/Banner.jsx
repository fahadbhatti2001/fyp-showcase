import React from "react"

export const Banner = () => {
  return (
    <section className="text-gray-600">
      <div className="mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Enhance Skills with Unique Projects
          </h1>
          <p className="mb-8 leading-relaxed">
            Discover a vast array of creative projects, topics, and development.
            We are dedicated to providing students with top-notch projects that
            facilitate the enhancement of their application development skills.
          </p>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:block hidden">
          <img
            className="object-cover object-center rounded"
            src="/images/vector.svg"
          />
        </div>
      </div>
    </section>
  )
}

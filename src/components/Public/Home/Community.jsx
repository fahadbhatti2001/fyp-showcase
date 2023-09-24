import React from "react"
import { Cards } from "@/static"

export const Community = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
            Community
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
            Tailored products designed for every aspect of your teams' needs.
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-primary-1 inline-flex"></div>
          </div>
        </div>
        <div className="flex flex-wrap -m-4 text-center">
          {Cards.map((e, i) => (
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="flex flex-col items-center gap-1 border-2 border-gray-200 px-4 py-6 rounded-lg">
                <e.icon className="w-12 h-12 text-primary-1" />
                <h2 className="title-font font-medium text-3xl text-gray-900">
                  {e.value}
                </h2>
                <p className="leading-relaxed">{e.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

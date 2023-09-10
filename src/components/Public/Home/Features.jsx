import React from "react"
import {
  BuildingOffice2Icon,
  FolderArrowDownIcon,
  GiftIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline"
import { Cards } from "@/static"

export const Features = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Features you got
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.
          </p>
        </div>
        <div className="flex flex-wrap -m-4 text-center">
          {
            Cards.map((e, i) => (
              <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                <div className="flex flex-col items-center gap-1 border-2 border-gray-200 px-4 py-6 rounded-lg">
                  <FolderArrowDownIcon className="w-12 h-12 text-primary-1" />
                  <h2 className="title-font font-medium text-3xl text-gray-900">{e.value}</h2>
                  <p className="leading-relaxed">{e.title}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

import { XCircleIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"

export const Chips = (props) => {
  const [chips, setchips] = useState(props.previousChips)
  const removeChip = (indexToRemove) => {
    setchips([...chips.filter((_, index) => index !== indexToRemove)])
    props.setchip([...chips.filter((_, index) => index !== indexToRemove)])
  }
  const addChips = (event) => {
    setchips([...chips, event.target.value])
    props.setchip([...chips, event.target.value])
    event.target.value = ""
  }

  return (
    <div className={props.className}>
      <label htmlFor="projectSupervisor" className="text-sm">
        {props.label}
      </label>
      <input
        disabled={chips.length < 10 ? false : true}
        type="text"
        autoComplete="off"
        placeholder={props.placeholder}
        onKeyUp={(event) => (event.key === "Enter" ? addChips(event) : null)}
        className="backdrop-blur-md mt-1 rounded py-1 px-2 bg-white/5 w-full border border-primary-1/50 focus:border-primary-1"
      />
      <div className="flex flex-col gap-2 mt-4 border border-primary-1/50 h-40 rounded shadow outline-none w-full p-4 overflow-auto">
        {chips == null
          ? null
          : chips.map((e, i) => (
              <div
                key={i}
                className="flex justify-between w-full bg-zinc-100 text-zinc-600 p-2 rounded"
              >
                <span className="flex items-center rounded-l text-sm">
                  {i + 1}. {e}
                </span>
                <span
                  className="flex items-center rounded-r cursor-pointer"
                  onClick={() => removeChip(i)}
                >
                  <XCircleIcon className="h-4 w-4 " />
                </span>
              </div>
            ))}
      </div>
    </div>
  )
}

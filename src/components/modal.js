import { useEffect, useMemo, useState } from "react"

export const Modal = ({ show, children, close }) => {
  const [classNames, setClassNames] = useState("opacity-0 hidden")

  useEffect(() => {
    let timeout
    if (show) {
      setClassNames("opacity-0")
      timeout = setTimeout(() => setClassNames("opacity-100"), 10)
    } else {
      setClassNames("opacity-0")
      timeout = setTimeout(() => setClassNames("opacity-0 hidden"), 300)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [show])

  const classesForCLose = useMemo(() => {
    return close ? "" : "hidden"
  }, [close])

  return (
    <div
      onClick={close}
      className={
        "transition-opacity ease-in-out delay-150 duration-300 bg-black/[0.9] flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-screen max-h-full " +
        classNames
      }
    >
      <button
        onClick={close}
        className={
          "h-14 w-14 text-white fixed top-0 left-0 p-4 z-10 " + classesForCLose
        }
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <g>
            <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
          </g>
        </svg>
      </button>
      <div className="relative p-4 max-w-full max-h-full">
        <button
          onClick={(event) => event.stopPropagation()}
          className="rounded-full bg-transparent border-none cursor-default"
        >
          {children}
        </button>
      </div>
    </div>
  )
}

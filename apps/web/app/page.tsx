
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Field, FieldLabel } from "~/components/ui/field"
import { Progress } from "~/components/ui/progress"

export default function LoadingPage() {
  const router = useRouter()

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          setTimeout(() => {
            router.push("/explore")
          }, 400)

          return 100
        }

        return prev + 5
      })
    }, 120)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div
        className="
          w-full
          max-w-xl
          border
          border-zinc-800
          bg-black
          p-8
        "
      >
        <Field className="w-full">
          <FieldLabel
            htmlFor="progress-upload"
            className="
              mb-6
              flex
              items-center
              gap-4
              font-mono
              text-xs
              uppercase
              tracking-[0.3em]
              text-white
            "
          >
            <span>Loading...</span>

            <span className="ml-auto text-zinc-400">
              {progress}%
            </span>
          </FieldLabel>

          <Progress
            value={progress}
            id="progress-upload"
            className="
    h-5
    overflow-hidden
    rounded-none
    border
    border-zinc-700
    bg-black
    p-[2px]
  "
          />
        </Field>
      </div>
    </div>
  )
}
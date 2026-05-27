/* app/f/[slug]/page.tsx */

"use client"

import { useParams } from "next/navigation"

import { trpc } from "~/trpc/client"
import { PublicForm } from "~/components/public-form"

export default function PublicFormPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, error } = trpc.form.publicBySlug.useQuery({ slug },
    {
      refetchOnWindowFocus: true,
      retry: false,
    },
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading form...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Form not found
      </div>
    )
  }

  return (
    <PublicForm
      form={data.form}
      fields={data.fields}
      theme={data.theme}
    />
  )
}
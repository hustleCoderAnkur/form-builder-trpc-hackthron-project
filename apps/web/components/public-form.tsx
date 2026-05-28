"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Check, Sparkles, Upload } from "lucide-react"
import { trpc } from "~/trpc/client"
import { Button } from "~/components/ui/button"
import { useUploadThing } from "../lib/uploadthing"
import type { ThemeConfig } from "~/types/theme"

type Field = {
  id: string
  type: string
  label: string
  isRequired: boolean
  validationConfig: Record<string, unknown>
}

export function PublicForm({ form, fields, theme }: {
  form: {
    id: string
    title: string
    description: string | null
  }
  fields: Field[]
  theme?: {
    config: ThemeConfig
  } | null
}) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const mouseY = useMotionValue(0)

  const warriorY = useSpring(mouseY, { stiffness: 60, damping: 20 })
  const bossY = useSpring(mouseY, { stiffness: 40, damping: 25 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const percent = e.clientY / window.innerHeight
      const movement = percent * 120 - 60
      mouseY.set(movement)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => { window.removeEventListener("mousemove", handleMouseMove) }
  }, [mouseY])

  const submit = trpc.response.submit.useMutation({
    onSuccess: () => setDone(true),
    onError: (e) => setError(e.message),
  })

  const cfg = theme?.config
  const primaryColor = cfg?.primaryColor ?? "#d6b36a"

  function setVal(fieldId: string, val: unknown) {
    setAnswers((prev) => ({ ...prev, [fieldId]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    for (const field of fields) {
      if (field.type === "section") continue
      if (!field.isRequired) continue
      const val = answers[field.id]
      const isEmpty = val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)
      if (isEmpty) {
        setError(`"${field.label}" is required.`)
        return
      }
    }
    submit.mutate({
      formId: form.id,
      answers: answers as Record<string, string | number | boolean | string[]>,
      respondentEmail: email || undefined,
    })
  }

  const completedFields = Object.values(answers).filter(Boolean).length
  const progress = Math.min(100, Math.round((completedFields / fields.length) * 100))

  if (done) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-[2.5rem] border border-white/10 bg-[#0b0b0b]/95 p-12 text-center max-w-xl w-full">
          <div className="relative w-24 h-24 rounded-[2rem] border border-white/10 bg-[#111111] flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10" style={{ color: primaryColor }} />
          </div>
          <h1 className="font-serif text-5xl tracking-tight text-[#fff8ee]">Thank You</h1>
          <p className="mt-5 text-zinc-300 leading-relaxed">Your response has been recorded successfully.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden py-12 px-4">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:38px_38px]" />

      <motion.img
        src="https://shakanksh.com/shakanksh/shakanksh-walk.webp"
        alt=""
        style={{ y: warriorY }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen w-20 sm:w-32 xl:w-70 object-contain z-0 pointer-events-none opacity-90"
      />

      <motion.img
        src="https://shakanksh.com/boss/boss-idle.webp"
        alt=""
        style={{ y: bossY }}
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="fixed right-0 top-0 h-screen w-28 sm:w-32 xl:w-108 p-10 object-contain z-0 pointer-events-none opacity-90"
      />

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm sm:max-w-xl xl:max-w-3xl mx-auto px-2 sm:px-0 xl:mr-[27rem] xl:ml-[18rem] rounded-[2.5rem] border border-white/10 bg-[#0b0b0b]/95 overflow-hidden"
      >
        <div className="relative px-10 py-10 border-b border-white/5">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 mb-5">
                <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">Public Form</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#fff8ee]">{form.title}</h1>
              {form.description && (
                <p className="mt-4 text-zinc-300 max-w-xl leading-relaxed">{form.description}</p>
              )}
            </div>
            <div className="min-w-[180px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">Progress</span>
                <span className="text-xs" style={{ color: primaryColor }}>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-black border border-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full" style={{ background: primaryColor }} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-10 space-y-6">
          {fields.map((field, index) => {
            if (field.type === "section") {
              return (
                <div key={field.id} className="pt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-white/5" />
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">{field.label}</p>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                </div>
              )
            }
            return (
              <motion.div key={field.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="relative rounded-[1.8rem] border border-white/10 bg-[#111111] p-7">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <label className="text-sm uppercase tracking-[0.25em] text-zinc-300">
                    {field.label}
                    {field.isRequired && <span className="ml-2" style={{ color: primaryColor }}>*</span>}
                  </label>
                </div>
                <FieldInput field={field} value={answers[field.id]} onChange={(val) => setVal(field.id, val)} primaryColor={primaryColor} />
              </motion.div>
            )
          })}

          <div className="rounded-[1.8rem] border border-white/10 bg-[#111111] p-7">
            <label className="text-sm uppercase tracking-[0.25em] text-zinc-300 block mb-5">Your Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-base text-[#fff8ee] placeholder:text-zinc-500 focus:outline-none" />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-sm text-red-400">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={submit.isPending} className="w-full h-16 rounded-2xl border border-white/10 bg-[#1a1a1a] hover:bg-[#202020]">
            {submit.isPending ? "Submitting..." : "Submit Response"}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}

function FieldInput({ field, value, onChange, primaryColor }: {
  field: Field
  value: unknown
  onChange: (val: unknown) => void
  primaryColor: string
}) {
  const { startUpload } = useUploadThing("formUploader")

  const inputClass = "w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-base text-[#fff8ee] placeholder:text-zinc-500 focus:outline-none transition-all"

  const options = (field.validationConfig?.options as { label: string; value: string }[]) ?? []

  switch (field.type) {
    case "short_text":
      return <input type="text" className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Your answer" />

    case "long_text":
      return <textarea rows={5} className={`${inputClass} resize-none`} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Your answer" />

    case "email":
      return <input type="email" className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="you@example.com" />

    case "number":
      return <input type="number" className={inputClass} value={(value as number) ?? ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="Enter number" />

    case "url":
      return <input type="url" className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com" />

    case "date":
      return <input type="date" className={`${inputClass} [color-scheme:dark]`} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />

    case "checkbox":
      return (
        <label className="flex items-center gap-4 cursor-pointer">
          <input type="checkbox" checked={(value as boolean) ?? false} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5" />
          <span className="text-zinc-300">Checkbox option</span>
        </label>
      )

    case "rating":
      return (
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = Number(value) >= n
            return (
              <button key={n} type="button" onClick={() => onChange(n)} className="w-12 h-12 rounded-xl border border-white/10 text-zinc-300 transition-all" style={active ? { background: primaryColor, color: "#000", borderColor: primaryColor } : {}}>
                {n}
              </button>
            )
          })}
        </div>
      )

    case "select":
      return (
        <select className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select option</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )

    case "multi_select": {
      const values = (value as string[]) ?? []
      return (
        <div className="flex flex-wrap gap-3">
          {options.map((o) => {
            const active = values.includes(o.value)
            return (
              <button key={o.value} type="button" onClick={() => { active ? onChange(values.filter((v) => v !== o.value)) : onChange([...values, o.value]) }} className="px-5 py-3 rounded-xl border border-white/10 text-zinc-300" style={active ? { background: primaryColor, color: "#000", borderColor: primaryColor } : {}}>
                {o.label}
              </button>
            )
          })}
        </div>
      )
    }

    case "upload":
      return (
        <div className="space-y-5">
          <label className="relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-[2rem] border border-dashed border-white/15 bg-black/30 cursor-pointer overflow-hidden hover:border-white/30 transition-all">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center mb-5">
                <Upload className="w-7 h-7 text-zinc-300" />
              </div>
              <div className="text-zinc-200 text-sm uppercase tracking-[0.25em]">Upload File</div>
              <p className="mt-4 text-sm text-zinc-500">Click to browse files</p>
            </div>
            <input type="file" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const res = await startUpload([file])
              const url = res?.[0]?.url
              if (url) { onChange(url) }
            }} />
          </label>
          {typeof value === "string" && (
            <a href={value} target="_blank" className="block rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-sm text-zinc-300">Uploaded File</a>
          )}
        </div>
      )

    default:
      return <input type="text" className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Your answer" />
  }
}
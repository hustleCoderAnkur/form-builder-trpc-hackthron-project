"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Plus, Trash2, Send, Eye, X, GripVertical, Sparkles, Check } from "lucide-react"
import { trpc } from "~/trpc/client"
import { FIELD_TYPES } from "~/lib/field-types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"

const INPUT =
  "w-full border border-white/10 bg-transparent px-4 py-3 font-mono text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-white/25 focus:border-[#b8a88a]/50"

type Option = {
  label: string
  value: string
}

type LocalField = {
  id: string
  type: string
  label: string
  isRequired: boolean
  validationConfig: Record<string, unknown>
}

export default function EditFormPage() {
  const { formId } = useParams<{ formId: string }>()
  const router = useRouter()

  const utils = trpc.useUtils()

  const { data, isLoading } = trpc.form.withFields.useQuery(
    { formId },
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: themes = [] } = trpc.theme.list.useQuery()

  const updateForm = trpc.form.update.useMutation()
  const addField = trpc.field.add.useMutation()
  const updateField = trpc.field.update.useMutation()
  const deleteField = trpc.field.delete.useMutation()
  const publish = trpc.form.publish.useMutation()
  const applyTheme = trpc.theme.applyTheme.useMutation()

  const [showTypes, setShowTypes] = useState(false)
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [localFields, setLocalFields] = useState<LocalField[]>([])
  const [newOptionText, setNewOptionText] = useState<Record<string, string>>({})
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!data) return

    setFormTitle(data.form.title)
    setFormDescription(data.form.description ?? "")
    setLocalFields(
      data.fields.map((field) => ({
        id: field.id,
        type: field.type,
        label: field.label,
        isRequired: field.isRequired,
        validationConfig: (field.validationConfig as Record<string, unknown>) ?? {},
      })),
    )
  }, [data])

  async function invalidateAll() {
    await Promise.all([
      utils.form.withFields.invalidate({ formId }),
      utils.form.publicBySlug.invalidate(),
    ])

    router.refresh()
  }

  async function saveForm(
    partial: Partial<{
      title: string
      description: string
      visibility: "public" | "unlisted"
    }>,
  ) {
    setIsSaving(true)

    try {
      await updateForm.mutateAsync({
        formId,
        ...partial,
      })

      await invalidateAll()
    } finally {
      setIsSaving(false)
    }
  }

  async function saveField(
    fieldId: string,
    partial: Partial<{
      label: string
      validationConfig: Record<string, unknown>
      isRequired: boolean
    }>,
  ) {
    setIsSaving(true)

    try {
      await updateField.mutateAsync({
        fieldId,
        formId,
        ...partial,
      })

      await invalidateAll()
    } finally {
      setIsSaving(false)
    }
  }

  function updateLocalField(fieldId: string, partial: Partial<LocalField>) {
    setLocalFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
            ...field,
            ...partial,
          }
          : field,
      ),
    )
  }

  function getOptions(field: LocalField): Option[] {
    return (field.validationConfig?.options as Option[]) ?? []
  }

  async function addOption(field: LocalField) {
    const text = (newOptionText[field.id] ?? "").trim()

    if (!text) return

    const current = getOptions(field)

    const updated = [
      ...current,
      {
        label: text,
        value: text.toLowerCase().replace(/\s+/g, "_"),
      },
    ]

    updateLocalField(field.id, {
      validationConfig: {
        ...field.validationConfig,
        options: updated,
      },
    })

    setNewOptionText((prev) => ({
      ...prev,
      [field.id]: "",
    }))

    await saveField(field.id, {
      validationConfig: {
        ...field.validationConfig,
        options: updated,
      },
    })
  }

  async function removeOption(field: LocalField, idx: number) {
    const current = getOptions(field)

    const updated = current.filter((_, i) => i !== idx)

    updateLocalField(field.id, {
      validationConfig: {
        ...field.validationConfig,
        options: updated,
      },
    })

    await saveField(field.id, {
      validationConfig: {
        ...field.validationConfig,
        options: updated,
      },
    })
  }

  async function handlePublish() {
    if (!data) return

    setIsSaving(true)

    try {
      await saveForm({
        title: formTitle,
        description: formDescription,
      })

      await Promise.all(
        localFields.map((field) =>
          saveField(field.id, {
            label: field.label,
            isRequired: field.isRequired,
            validationConfig: field.validationConfig,
          }),
        ),
      )

      await publish.mutateAsync({ formId })

      await invalidateAll()
    } finally {
      setIsSaving(false)
    }
  }

  const form = data?.form

  if (isLoading || !data || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-[#0a0a0a]">
            <Sparkles className="h-5 w-5 animate-pulse text-white/70" />
          </div>

          <p className="text-[8px] uppercase tracking-[0.4em] text-white/30">
            Loading Editor...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] font-mono text-[#f0ede8]">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.018]" />

      <div className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-white/[0.055] bg-[#050505]/95 px-6 backdrop-blur-xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/40 transition-all hover:border-white/20 hover:text-white"
        >
          <ChevronLeft size={15} />
        </button>

        <input
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          onBlur={async () => {
            if (formTitle !== form.title) {
              await saveForm({
                title: formTitle,
              })
            }
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault()

              await saveForm({
                title: formTitle,
              })
            }
          }}
          className="min-w-0 flex-1 border-b border-transparent bg-transparent pb-0.5 font-mono text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-white/25 focus:border-white/20"
          placeholder="Form title"
        />

        <div className="flex shrink-0 items-center gap-2">
          <Select
            value={form.visibility}
            onValueChange={async (v) => {
              await saveForm({
                visibility: v as "public" | "unlisted",
              })
            }}
          >
            <SelectTrigger className="h-8 w-28 rounded-none border border-white/10 bg-[#0d0d0d] font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-none border border-white/10 bg-[#0d0d0d]">
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>

          {form.status === "published" && (
            <Link href={`/f/${form.slug}`} target="_blank">
              <button className="flex h-9 items-center gap-2 border border-white/10 px-4 text-[9px] uppercase tracking-[0.2em] text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.03] hover:text-white">
                <Eye size={13} />
                Preview
              </button>
            </Link>
          )}

          <button
            onClick={handlePublish}
            disabled={isSaving || publish.isPending}
            className="flex h-9 items-center gap-2 bg-[#b8a88a] px-5 text-[9px] font-medium uppercase tracking-[0.25em] text-[#050505] transition-all hover:bg-[#c8b89a] disabled:opacity-50"
          >
            <Send size={13} />
            {publish.isPending ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="relative z-[1] mx-auto max-w-3xl space-y-3 px-4 py-8 sm:px-6">
        {localFields.map((field, index) => (
          <motion.div key={field.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="border border-white/[0.07] bg-[#060606]">
              <div className="flex items-start gap-3 px-5 pb-0 pt-5">
                <div className="mt-1 text-white/20">
                  <GripVertical size={15} />
                </div>

                <div className="flex-1">
                  <input
                    value={field.label}
                    onChange={(e) =>
                      updateLocalField(field.id, {
                        label: e.target.value,
                      })
                    }
                    onBlur={async () => {
                      await saveField(field.id, {
                        label: field.label,
                      })
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()

                        await saveField(field.id, {
                          label: field.label,
                        })
                      }
                    }}
                    className="w-full border-b border-transparent bg-transparent text-sm outline-none focus:border-white/20"
                    placeholder="Field label"
                  />

                  <p className="mt-2 text-[8px] uppercase tracking-[0.3em] text-white/25">
                    {field.type.replace(/_/g, " ")}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await deleteField.mutateAsync({
                      fieldId: field.id,
                      formId,
                    })

                    await invalidateAll()

                    setLocalFields((prev) => prev.filter((f) => f.id !== field.id))
                  }}
                  className="flex h-8 w-8 items-center justify-center text-white/20 hover:text-red-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="px-5 py-5 pl-[52px]">
                {renderFieldPreview({
                  field,
                  getOptions,
                  newOptionText,
                  setNewOptionText,
                  addOption,
                  removeOption,
                  ratingValues,
                  setRatingValues,
                })}
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.055] px-5 py-3">
                <label className="flex items-center gap-3">
                  <Switch
                    checked={field.isRequired}
                    onCheckedChange={async (checked) => {
                      updateLocalField(field.id, {
                        isRequired: checked,
                      })

                      await saveField(field.id, {
                        isRequired: checked,
                      })
                    }}
                  />

                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                    Required
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        ))}

        <AnimatePresence mode="wait">
          {showTypes ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-[#b8a88a]/20 bg-[#060606]"
            >
              <div className="grid grid-cols-2 gap-px bg-white/[0.04] p-px md:grid-cols-3">
                {FIELD_TYPES.map((ft) => (
                  <button
                    key={ft.type}
                    type="button"
                    onClick={async () => {
                      await addField.mutateAsync({
                        formId,
                        type: ft.type,
                        label: `New ${ft.label}`,
                        order: localFields.length,
                      })

                      await invalidateAll()

                      setShowTypes(false)
                    }}
                    className="flex items-center gap-3 bg-[#060606] px-4 py-4 hover:bg-white/[0.04]"
                  >
                    <ft.icon className="h-4 w-4" />

                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {ft.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowTypes(true)}
              className="flex w-full items-center justify-center gap-3 border border-dashed border-white/10 py-7 text-white/25"
            >
              <Plus size={12} />
              Add Field
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function renderFieldPreview({
  field,
  getOptions,
  newOptionText,
  setNewOptionText,
  addOption,
  removeOption,
  ratingValues,
  setRatingValues,
}: any) {
  switch (field.type) {
    case "short_text":
      return <input type="text" placeholder="Short answer" className={INPUT} />

    case "long_text":
      return <textarea rows={4} placeholder="Long answer" className={`${INPUT} resize-none`} />

    case "email":
      return <input type="email" placeholder="Email" className={INPUT} />

    case "number":
      return <input type="number" placeholder="Number" className={INPUT} />

    case "date":
      return <input type="date" className={`${INPUT} [color-scheme:dark]`} />

    case "url":
      return <input type="url" placeholder="https://example.com" className={INPUT} />

    case "checkbox":
      return (
        <label className="flex items-center gap-3">
          <input type="checkbox" />
          Checkbox option
        </label>
      )

    case "rating":
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() =>
                setRatingValues((prev: any) => ({
                  ...prev,
                  [field.id]: n,
                }))
              }
              className="h-10 w-10 border border-white/10"
            >
              {n}
            </button>
          ))}
        </div>
      )

    case "section":
      return (
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-white/10" />

          <div className="text-[8px] uppercase tracking-[0.4em] text-white/20">
            Section Break
          </div>

          <div className="h-px flex-1 bg-white/10" />
        </div>
      )

    case "select":
    case "multi_select": {
      const options = getOptions(field)

      return (
        <OptionManager
          options={options}
          newText={newOptionText[field.id] ?? ""}
          onNewTextChange={(text: string) =>
            setNewOptionText((prev: any) => ({
              ...prev,
              [field.id]: text,
            }))
          }
          onAdd={() => addOption(field)}
          onRemove={(idx: number) => removeOption(field, idx)}
        />
      )
    }

    case "upload":
      return (
        <div className="space-y-4">
          <label className="flex min-h-[180px] w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/30 transition-all hover:border-[#b8a88a]/30">
            <div className="text-center">
              <div className="text-sm uppercase tracking-[0.25em] text-white/60">
                Upload File
              </div>

              <p className="mt-3 text-xs text-white/25">
                Click to browse files
              </p>
            </div>

            <input type="file" className="hidden" />
          </label>
        </div>
      )

    default:
      return <input type="text" placeholder="Input" className={INPUT} />
  }
}

function OptionManager({
  options,
  newText,
  onNewTextChange,
  onAdd,
  onRemove,
}: {
  options: { label: string; value: string }[]
  newText: string
  onNewTextChange: (text: string) => void
  onAdd: () => void
  onRemove: (idx: number) => void
}) {
  return (
    <div className="space-y-2">
      {options.map((o, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex-1 border border-white/[0.07] px-3 py-2 text-[11px]">
            {o.label}
          </span>

          <button
            type="button"
            onClick={() => onRemove(i)}
            className="flex h-8 w-8 items-center justify-center"
          >
            <X size={12} />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={newText}
          onChange={(e) => onNewTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onAdd()
            }
          }}
          className="flex-1 border border-dashed border-white/15 bg-transparent px-3 py-2"
          placeholder="Add option..."
        />

        <button
          type="button"
          onClick={onAdd}
          className="border border-white/10 px-4"
        >
          Add
        </button>
      </div>
    </div>
  )
}
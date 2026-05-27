"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  Plus,
  FileText,
  BarChart3,
  Pencil,
  Trash2,
  Globe,
  EyeOff,
  MoreHorizontal,
  Zap,
  LayoutGrid,
  Send,
  Archive,
} from "lucide-react"
import Image from "next/image"
import { trpc } from "~/trpc/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const router = useRouter()

  const { data: forms, isLoading, refetch } = trpc.form.list.useQuery()

  const createForm = trpc.form.create.useMutation({
    onSuccess: (f) => router.push(`/dashboard/forms/${f.id}/edit`),
  })

  const deleteForm = trpc.form.delete.useMutation({
    onSuccess: () => refetch(),
  })

  const publish = trpc.form.publish.useMutation({
    onSuccess: () => refetch(),
  })

  const unpublish = trpc.form.unpublish.useMutation({
    onSuccess: () => refetch(),
  })

  const [showNew, setShowNew] = useState(false)
  const [title, setTitle] = useState("")

  const total = forms?.length ?? 0
  const published = forms?.filter((f) => f.status === "published").length ?? 0
  const drafts = forms?.filter((f) => f.status !== "published").length ?? 0

  const handleCreate = () => {
    if (!title.trim()) return

    createForm.mutate({ title: title.trim() })

    setTitle("")
    setShowNew(false)
  }

  return (
    <div className="p-6 lg:p-10">
      <section className="relative mb-8 min-h-[520px] overflow-hidden border border-white/10 bg-[#060606]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(200,184,154,0.08),transparent_35%)]" />

        <div
          className="absolute bottom-0 left-0 right-0 h-14 opacity-20"
          style={{
            backgroundImage: "url('/effects/floor.webp')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
          }}
        />

        <div className="relative z-10 flex min-h-[520px] items-center justify-between px-8 py-12 lg:px-14">
          <div className="max-w-[620px]">
            <p className="mb-6 text-[10px] uppercase tracking-[0.45em] text-[#b8a88a]">
              Creator Workspace / Active
            </p>

            <h1 className="font-serif text-6xl leading-[0.82] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              MY FORMS
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-white/40 lg:text-base">
              Create immersive forms, manage workflows and track realtime responses from your creator terminal.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <button
                onClick={() => setShowNew(true)}
                className="h-12 bg-white px-7 text-[10px] uppercase tracking-[0.3em] text-black transition-all hover:bg-neutral-200"
              >
                Create Form
              </button>
            </div>

            <div className="flex items-center gap-8 pt-10">
              {[
                { label: "Total", value: total },
                { label: "Live", value: published },
                { label: "Draft", value: drafts },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-lg font-semibold text-[#b8a88a]">
                    {s.value}
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute right-[40px] top-1/2 hidden h-full w-[420px] -translate-y-1/2 items-center justify-center lg:flex">
            <div className="absolute h-[180px] w-[180px] animate-[weaponGlow_2.6s_linear_infinite] rounded-full bg-[#b8a88a]/10 blur-[60px]" />

            <div className="absolute bottom-[28%] h-[20px] w-[120px] animate-[weaponShadow_2.6s_linear_infinite] rounded-full bg-black/40 blur-xl" />

            <div className="relative animate-[weaponBounce_3.8s_linear_infinite]">
              <Image
                src="https://shakanksh.com/effects/weapon-axe.webp"
                alt="weapon"
                width={320}
                height={320}
                priority
                unoptimized
                draggable={false}
                className="relative z-10 h-auto w-[220px] rotate-[-40deg] select-none object-contain opacity-95 drop-shadow-[0_0_25px_rgba(200,184,154,0.18)] [image-rendering:pixelated] xl:w-[280px]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "Total Forms",
            value: total,
            icon: FileText,
            sub: "Workspace",
          },
          {
            label: "Published",
            value: published,
            icon: Globe,
            sub: "Live Now",
          },
          {
            label: "Drafts",
            value: drafts,
            icon: LayoutGrid,
            sub: "In Progress",
          },
          {
            label: "Responses",
            value: "—",
            icon: Zap,
            sub: "This Month",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="border border-white/10 bg-[#060606] p-6 transition-all hover:border-[#b8a88a]/30"
          >
            <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/35">
              <card.icon className="h-4 w-4" />
              {card.label}
            </div>

            <div className="mb-3 font-serif text-5xl leading-none">
              {card.value}
            </div>

            <div className="text-[10px] uppercase tracking-[0.25em] text-white/25">
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-[#b8a88a]/50" />

          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
            Form Registry
          </p>
        </div>

        <button
          onClick={() => setShowNew(true)}
          className="flex h-10 items-center gap-2 bg-white px-5 text-[10px] uppercase tracking-[0.3em] text-black transition-all hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
          New Form
        </button>
      </div>

      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-6 border border-[#b8a88a]/20 bg-[#0a0a0a] p-5">
              <div className="flex flex-col gap-3 lg:flex-row">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter form name..."
                  className="h-12 flex-1 border border-white/10 bg-black px-5 text-sm outline-none focus:border-[#b8a88a]/40"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate()
                  }}
                  autoFocus
                />

                <button
                  onClick={handleCreate}
                  className="h-12 bg-white px-6 text-[10px] uppercase tracking-[0.3em] text-black transition-all hover:bg-neutral-200"
                >
                  Initialize
                </button>

                <button
                  onClick={() => {
                    setShowNew(false)
                    setTitle("")
                  }}
                  className="h-12 border border-white/10 px-6 text-[10px] uppercase tracking-[0.3em] transition-all hover:border-white/20 hover:bg-white/[0.03]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[240px] animate-pulse border border-white/10 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : forms?.length === 0 ? (
        <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden border border-white/10 bg-[#060606]">
          <div className="relative z-10 px-6 text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-[#b8a88a]/20 bg-[#b8a88a]/5">
              <FileText className="h-8 w-8 text-[#b8a88a]/60" />
            </div>

            <h2 className="mb-5 font-serif text-5xl">
              NO FORMS YET
            </h2>

            <p className="mx-auto mb-10 max-w-md text-sm leading-8 text-white/35">
              Initialize your first form and begin building immersive experiences for your audience.
            </p>

            <button
              onClick={() => setShowNew(true)}
              className="h-12 bg-white px-8 text-[10px] uppercase tracking-[0.35em] text-black transition-all hover:bg-neutral-200"
            >
              Initialize First Form
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {forms?.map((form) => (
            <motion.div
              key={form.id}
              variants={item}
              className="group flex flex-col border border-white/10 bg-[#060606] transition-all hover:border-[#b8a88a]/30"
            >
              <div className="flex-1 p-6">
                <div
                  className={`mb-5 inline-flex h-8 items-center gap-2 border px-3 text-[9px] uppercase tracking-[0.3em] ${form.status === "published"
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                      : "border-[#b8a88a]/20 bg-[#b8a88a]/5 text-[#b8a88a]"
                    }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${form.status === "published"
                        ? "bg-emerald-400"
                        : "bg-[#b8a88a]"
                      }`}
                  />

                  {form.status}
                </div>

                <h2 className="mb-5 font-serif text-3xl leading-tight transition-colors group-hover:text-[#b8a88a]">
                  {form.title}
                </h2>

                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/25">
                    Updated{" "}
                    {formatDistanceToNow(new Date(form.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>

                  {form.status === "published" && (
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/30">
                      {form.visibility === "public" ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Unlisted
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex h-16 items-center justify-between border-t border-white/10 bg-black/30 px-4">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/forms/${form.id}/edit`}>
                    <button className="flex h-10 w-10 items-center justify-center border border-transparent transition-all hover:border-white/10 hover:bg-white/[0.03]">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </Link>

                  <Link href={`/dashboard/forms/${form.id}/analytics`}>
                    <button className="flex h-10 w-10 items-center justify-center border border-transparent transition-all hover:border-white/10 hover:bg-white/[0.03]">
                      <BarChart3 className="h-4 w-4" />
                    </button>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-10 w-10 items-center justify-center border border-transparent transition-all hover:border-white/10 hover:bg-white/[0.03]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="min-w-[180px] rounded-none border border-white/10 bg-[#0b0b0b] text-white"
                  >
                    {form.status === "published" ? (
                      <>
                        <DropdownMenuItem
                          className="h-10 cursor-pointer text-xs uppercase tracking-[0.2em]"
                          onClick={() => window.open(`/f/${form.slug}`, "_blank")}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          View Live
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="h-10 cursor-pointer text-xs uppercase tracking-[0.2em]"
                          onClick={() => unpublish.mutate({ formId: form.id })}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Unpublish
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem
                        className="h-10 cursor-pointer text-xs uppercase tracking-[0.2em]"
                        onClick={() => publish.mutate({ formId: form.id })}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Publish
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      className="h-10 cursor-pointer text-xs uppercase tracking-[0.2em] text-red-400"
                      onClick={() => deleteForm.mutate({ formId: form.id })}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
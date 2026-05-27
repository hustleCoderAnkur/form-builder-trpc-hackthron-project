"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Key,
  Shield,
  ExternalLink,
  Sparkles,
  Trophy,
  Terminal,
} from "lucide-react"

import { trpc } from "~/trpc/client"
import { Button } from "~/components/ui/button"
import { OrnamentDivider } from "~/components/ui/decorative-patterns"

export default function SettingsPage() {
  const { data: user } = trpc.auth.me.useQuery()

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.03]" />

        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-maroon/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,black)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-[#d6b36a]" />

                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                  Player Settings
                </span>
              </div>

              <h1 className="font-serif text-5xl leading-none tracking-tight text-[#f5e7c8] md:text-6xl">
                Control Center
              </h1>

              <p className="mt-5 max-w-xl leading-relaxed text-zinc-500">
                Manage your profile, credentials, account security and developer resources from your personalized dashboard.
              </p>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 rounded-full bg-maroon/20 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-[#070707]/90 p-4 backdrop-blur-2xl">
                <div className="relative h-[260px] w-[220px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                  <Image
                    src="https://shakanksh.com/sprite.webp"
                    alt="avatar"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 rounded-full border border-gold/20 bg-black/90 px-4 py-2">
                    <Trophy className="h-4 w-4 text-[#d6b36a]" />

                    <span className="text-[11px] tracking-[0.25em] text-[#f5e7c8]">
                      LEVEL 42
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <OrnamentDivider className="my-10" />

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707]/95"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.025]" />

              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-maroon/10 blur-3xl" />

              <div className="relative border-b border-white/5 bg-white/[0.02] px-8 py-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-[#0d0d0d]">
                    <User className="h-6 w-6 text-[#d6b36a]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-3xl text-[#f5e7c8]">
                        Profile Information
                      </h2>

                      <div className="h-2 w-2 rounded-full bg-[#d6b36a]" />
                    </div>

                    <p className="mt-2 text-sm text-zinc-500">
                      Identity & account visibility
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative grid gap-6 p-8 md:grid-cols-2">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="relative rounded-[1.8rem] border border-white/10 bg-[#0d0d0d] p-6 transition-all duration-300 hover:bg-[#101010]"
                >
                  <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#d6b36a]" />

                  <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] border border-white/10 bg-black">
                      <User className="h-7 w-7 text-[#d6b36a]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                          Username
                        </p>

                        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1">
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400">
                            Active
                          </span>
                        </div>
                      </div>

                      <p className="mt-5 text-2xl font-semibold text-[#f8f3e7]">
                        {user.name || "Not set"}
                      </p>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                            Profile Completion
                          </span>

                          <span className="text-xs text-[#d6b36a]">
                            84%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full border border-white/5 bg-black">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "84%" }}
                            transition={{ duration: 1 }}
                            className="h-full rounded-full bg-gradient-to-r from-maroon to-[#d6b36a]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="relative rounded-[1.8rem] border border-white/10 bg-[#0d0d0d] p-6 transition-all duration-300 hover:bg-[#101010]"
                >
                  <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-cyan-400" />

                  <div className="absolute inset-0 rounded-[1.8rem] bg-cyan-500/[0.015]" />

                  <div className="relative flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] border border-white/10 bg-black">
                      <Mail className="h-7 w-7 text-cyan-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                          Email Address
                        </p>

                        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1">
                          <span className="text-[10px] uppercase tracking-wider text-cyan-400">
                            Verified
                          </span>
                        </div>
                      </div>

                      <p className="mt-5 break-all text-xl font-semibold text-[#f8f3e7]">
                        {user.email}
                      </p>

                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-cyan-400" />

                        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                          Synced Credentials
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707]/95"
            >
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />

              <div className="relative border-b border-white/5 bg-white/[0.02] px-8 py-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-[#0d0d0d]">
                    <Shield className="h-6 w-6 text-[#d6b36a]" />
                  </div>

                  <div>
                    <h2 className="font-serif text-3xl text-[#f5e7c8]">
                      Security Matrix
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      Authentication & protection layers
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-6 rounded-[1.8rem] border border-white/10 bg-[#0d0d0d] p-6">
                  <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] border border-white/10 bg-black">
                      <Key className="h-7 w-7 text-[#d6b36a]" />
                    </div>

                    <div>
                      <p className="text-2xl font-semibold text-[#f8f3e7]">
                        Password Credentials
                      </p>

                      <p className="mt-2 text-sm text-zinc-500">
                        Last updated 30 days ago
                      </p>
                    </div>
                  </div>

                  <Button className="rounded-2xl border border-white/15 bg-[#151515] px-6 text-[#f5e7c8] hover:bg-[#1a1a1a]">
                    Change Password
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707]/95"
            >
              <div className="relative border-b border-white/5 bg-white/[0.02] px-8 py-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-[#0d0d0d]">
                    <Terminal className="h-6 w-6 text-cyan-400" />
                  </div>

                  <div>
                    <h2 className="font-serif text-3xl text-[#f5e7c8]">
                      Developer Access
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      APIs, integrations & technical resources
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="relative flex flex-wrap items-center justify-between gap-6 rounded-[1.8rem] border border-white/10 bg-[#0d0d0d] p-6">
                  <div>
                    <p className="text-2xl font-semibold text-[#f8f3e7]">
                      API Documentation
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Access the formFactory API documentation portal.
                    </p>
                  </div>

                  <a
                    href={
                      process.env.NEXT_PUBLIC_API_URL?.replace("/trpc", "") ??
                      "https://form-builder-trpc-hackthron-project.vercel.app/docs"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button className="gap-2 rounded-2xl border border-cyan-500/20 bg-[#151515] px-6 text-cyan-300 hover:bg-cyan-500/10">
                      <ExternalLink className="h-4 w-4" />
                      Open Docs
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
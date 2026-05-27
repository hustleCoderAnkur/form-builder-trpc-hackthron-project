"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Download, Users, TrendingUp, Eye, Clock, Sparkles, Globe, ChevronRight, Activity } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts"
import { trpc } from "~/trpc/client"

const ease = [0.22, 1, 0.36, 1] as const

const ACCENT = "#c8b89a"
const ACCENT2 = "#4caf82"

const PIE_COLORS = [ACCENT, "rgba(200,184,154,0.55)", "rgba(200,184,154,0.25)"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 14px",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <div
        style={{
          fontSize: 8,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(240,237,232,0.3)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      {payload.map((p: any) => (
        <div
          key={p.dataKey}
          style={{
            fontSize: 11,
            color: p.color,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {p.dataKey}:{" "}
          <span
            style={{
              color: "#f0ede8",
              fontWeight: 500,
            }}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { formId } = useParams<{ formId: string }>()

  const [dateRange, setDateRange] = useState("7d")

  const { data: formData, isLoading } = trpc.form.withFields.useQuery({ formId })

  const { data: analytics, isLoading: analyticsLoading } = trpc.form.analytics.useQuery({ formId })

  const form = formData?.form

  const responses = analytics?.recentResponses ?? []

  const totalSubmissions = analytics?.totalSubmissions ?? 0

  const totalViews = analytics?.totalViews ?? 0

  const conversionRate = analytics?.conversionRate ?? 0

  const averageCompletion = analytics?.averageCompletion ?? "0m"

  const submissionChartData = analytics?.submissionChartData ?? []

  const deviceData = analytics?.deviceData ?? [
    {
      name: "Desktop",
      value: 0,
    },
    {
      name: "Mobile",
      value: 0,
    },
    {
      name: "Tablet",
      value: 0,
    },
  ]

  const sourceData = analytics?.sourceData ?? []

  const stats = [
    {
      label: "Total Submissions",
      value: totalSubmissions.toString(),
      change: "+12%",
      up: true,
      icon: Users,
    },
    {
      label: "Total Views",
      value: totalViews.toString(),
      change: "+8%",
      up: true,
      icon: Eye,
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      change: "+2.3%",
      up: true,
      icon: TrendingUp,
    },
    {
      label: "Avg Completion",
      value: averageCompletion,
      change: "-12s",
      up: false,
      icon: Clock,
    },
  ]

  if (isLoading || analyticsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-[#0a0a0a]">
            <Sparkles className="h-5 w-5 animate-pulse text-white/70" />
          </div>

          <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/30">
            Loading Analytics...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] font-mono text-[#f0ede8]">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.018]" />

      <div className="fixed inset-0 z-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_3px)] opacity-[0.03]" />

      <div className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/[0.055] bg-[#050505]/95 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-9 items-center gap-2 border border-white/10 px-4 text-[9px] uppercase tracking-[0.25em] text-white/40 transition-all hover:border-white/20 hover:text-white"
          >
            <ChevronLeft size={12} />
            Back
          </Link>

          <div className="hidden items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-white/25 md:flex">
            <span>formFactory</span>
            <ChevronRight size={9} />
            <span>Dashboard</span>
            <ChevronRight size={9} />
            <span className="text-white/60">Analytics</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 border border-white/10 bg-[#0d0d0d] px-4 text-[9px] uppercase tracking-[0.2em] text-white/50 outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          <button className="flex h-9 items-center gap-2 border border-white/10 px-4 text-[9px] uppercase tracking-[0.25em] text-white/40 transition-all hover:border-white/20 hover:text-white">
            <Download size={12} />
            Export
          </button>
        </div>
      </div>

      <div className="relative z-10 space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[180px] overflow-hidden border border-white/[0.055] bg-[#080808] p-8"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.02]" />

          <motion.img
            src="https://shakanksh.com/boss/boss-idle.webp"
            alt=""
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute bottom-0 right-0 mr-10 h-50 select-none object-contain opacity-40"
          />

          <div className="relative z-10">
            <div className="mb-4 text-[8px] uppercase tracking-[0.4em] text-[#c8b89a]/70">
              Live Intelligence Dashboard
            </div>

            <h1 className="font-serif text-5xl uppercase leading-[0.9] tracking-[-0.04em] md:text-7xl">
              {form?.title || "Form"}
              <br />
              Analytics
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/[0.055] bg-[#080808] p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center border border-[#c8b89a]/20 bg-[#c8b89a]/5">
                  <s.icon size={16} color={ACCENT} />
                </div>

                <div
                  className={`border px-2 py-1 text-[8px] uppercase tracking-[0.2em] ${s.up ? "border-emerald-500/20 text-emerald-400" : "border-yellow-500/20 text-yellow-400"
                    }`}
                >
                  {s.change}
                </div>
              </div>

              <div className="font-serif text-5xl leading-none">{s.value}</div>

              <div className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/30">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="border border-white/[0.055] bg-[#080808] p-6">
            <div className="mb-6">
              <h2 className="font-serif text-2xl">Submission Activity</h2>

              <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-white/30">
                Views vs submissions
              </p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={submissionChartData}>
                  <defs>
                    <linearGradient id="subGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(240,237,232,0.35)",
                      fontSize: 9,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(240,237,232,0.35)",
                      fontSize: 9,
                    }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="submissions"
                    stroke={ACCENT}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#subGradient)"
                  />

                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke={ACCENT2}
                    strokeWidth={2}
                    fillOpacity={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-white/[0.055] bg-[#080808] p-6">
            <div className="mb-6">
              <h2 className="font-serif text-2xl">Device Split</h2>

              <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-white/30">
                Device analytics
              </p>
            </div>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {deviceData.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3">
              {deviceData.map((d: any, i: number) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />

                    <span className="text-white/50">{d.name}</span>
                  </div>

                  <span className="text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-white/[0.055] bg-[#080808] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl">Traffic Sources</h2>

              <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-white/30">
                Source breakdown
              </p>
            </div>

            <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.25em] text-white/30">
              <Globe size={11} />
              Organic Reach
            </div>
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(240,237,232,0.35)",
                    fontSize: 9,
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="source"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  tick={{
                    fill: "rgba(240,237,232,0.45)",
                    fontSize: 9,
                  }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="count" fill={ACCENT} radius={[0, 3, 3, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden border border-white/[0.055] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-5">
            <div>
              <h2 className="font-serif text-2xl">Recent Responses</h2>

              <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-white/30">
                Live response feed
              </p>
            </div>

            <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.25em] text-emerald-400">
              <Activity size={10} />
              Live
            </div>
          </div>

          {responses.length === 0 ? (
            <div className="px-6 py-16 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
              No responses yet
            </div>
          ) : (
            responses.map((r: any, i: number) => (
              <div
                key={r.id}
                className="flex items-center justify-between border-b border-white/[0.03] px-6 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#c8b89a]/20 bg-[#c8b89a]/5 text-[#c8b89a]">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <div className="text-sm text-white/70">
                      {r.respondentEmail || "Anonymous"}
                    </div>

                    <div className="mt-1 text-[8px] uppercase tracking-[0.25em] text-white/25">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <button className="h-8 border border-white/10 px-4 text-[8px] uppercase tracking-[0.25em] text-white/40 transition-all hover:border-white/20 hover:text-white">
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
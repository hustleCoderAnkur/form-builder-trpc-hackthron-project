"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, BarChart3, Terminal, Shield, Zap, Sparkles, LogOut, ChevronRight, ChevronLeft, Menu, X } from "lucide-react"
import { trpc } from "~/trpc/client"

const ease = [0.22, 1, 0.36, 1] as const

const navLinks = [
  { href: "/dashboard", label: "Forms", icon: FileText, section: "Workspace" },
  { href: "/dashboard/settings", label: "Settings", icon: Terminal, section: "System" },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const { data: user, isLoading, isError } = trpc.auth.me.useQuery()
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => router.push("/login") })

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isError, user, router, pathname])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  if (isLoading || !user) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 border border-white/10 bg-[#0a0a0a] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white/70 animate-pulse" />
        </div>
        <div className="text-[8px] uppercase tracking-[0.4em] text-white/30">Initializing Terminal...</div>
      </div>
    )
  }

  const workspaceLinks = navLinks.filter((l) => l.section === "Workspace")
  const systemLinks = navLinks.filter((l) => l.section === "System")
  const userInitial = (user.name?.[0] || user.email[0]).toUpperCase()

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(href + "/")

  const currentLabel = navLinks.find((l) => isActive(l.href))?.label ?? "Forms"

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0ede8] font-mono relative flex overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.018] z-0 bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.025)_2px,rgba(0,0,0,0.025)_4px)]" />

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#050505]/95 backdrop-blur-xl border-b border-white/[0.055] flex items-center justify-between px-5">
        <Link href="/dashboard" className="font-serif text-xl font-black tracking-[0.04em] uppercase">FormForge</Link>
        <button onClick={() => setMobileOpen((o) => !o)} className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/70" aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22, ease }} className="lg:hidden fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl pt-20 px-5 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`h-12 px-4 border flex items-center gap-3 uppercase tracking-[0.18em] text-[10px] transition-all ${isActive(link.href) ? "border-white/10 bg-white/[0.04] text-white" : "border-transparent text-white/40 hover:border-white/10 hover:bg-white/[0.03] hover:text-white"}`}>
                <link.icon size={15} />
                {link.label}
              </Link>
            ))}
            <div className="mt-auto pb-8">
              <button onClick={() => logout.mutate()} className="w-full h-12 px-4 border border-white/10 text-red-400 uppercase tracking-[0.18em] text-[10px] hover:bg-red-500/10 transition-all flex items-center gap-3">
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-20 bg-[#050505]/95 backdrop-blur-xl border-r border-white/[0.055] flex-col transition-[width] duration-200 ${collapsed ? "w-[68px]" : "w-[240px]"}`}>
        <Link href="/dashboard" className="h-[68px] border-b border-white/[0.055] flex items-center gap-4 px-[18px] overflow-hidden shrink-0">
          <div className="w-9 h-9 shrink-0 border border-white/10 bg-[#0d0d0d] flex items-center justify-center">
            <Sparkles size={15} className="text-[#f0ede8]" />
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <div className="text-[6.5px] tracking-[0.4em] uppercase text-white/30 mb-1 whitespace-nowrap">Creator Terminal</div>
              <div className="font-serif text-[18px] font-black tracking-[0.04em] uppercase leading-none whitespace-nowrap">FormForge</div>
            </div>
          )}
        </Link>

        <button onClick={() => setCollapsed((c) => !c)} className="absolute -right-3 top-17 w-6 h-6 bg-[#0d0d0d] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all z-10" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <nav className="flex-1 px-3 py-5 overflow-hidden">
          {!collapsed && <div className="text-[6.5px] tracking-[0.42em] uppercase text-white/20 px-2 mb-2">Workspace</div>}
          {workspaceLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link key={link.href} href={link.href} title={collapsed ? link.label : undefined} className={`relative h-11 px-[10px] flex items-center gap-3 uppercase tracking-[0.18em] text-[10px] border transition-all overflow-hidden whitespace-nowrap ${active ? "border-white/10 bg-white/[0.04] text-white" : "border-transparent text-white/40 hover:border-white/[0.06] hover:bg-white/[0.025] hover:text-white"}`}>
                {active && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#c8b89a]" />}
                <link.icon size={15} className="shrink-0" />
                {!collapsed && link.label}
              </Link>
            )
          })}

          {!collapsed && <div className="text-[6.5px] tracking-[0.42em] uppercase text-white/20 px-2 mt-5 mb-2">System</div>}
          {collapsed && <div className="h-3" />}

          {systemLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link key={link.href} href={link.href} title={collapsed ? link.label : undefined} className={`relative h-11 px-[10px] flex items-center gap-3 uppercase tracking-[0.18em] text-[10px] border transition-all overflow-hidden whitespace-nowrap ${active ? "border-white/10 bg-white/[0.04] text-white" : "border-transparent text-white/40 hover:border-white/[0.06] hover:bg-white/[0.025] hover:text-white"}`}>
                {active && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#c8b89a]" />}
                <link.icon size={15} className="shrink-0" />
                {!collapsed && link.label}
              </Link>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-white/[0.055] p-3 shrink-0">
            <img src="https://shakanksh.com/npc/npc-idle.webp" alt="" draggable={false} style={{ imageRendering: "pixelated" }} className="h-[90px] w-auto mx-auto" />
            <div className="flex items-center gap-2 mt-2 px-1 text-[7px] tracking-[0.3em] uppercase text-white/25 whitespace-nowrap overflow-hidden">
              <div className="w-[5px] h-[5px] bg-emerald-400 opacity-80 shrink-0" />
              System Online
            </div>
          </div>
        )}

        <div className="border-t border-white/[0.055] p-3 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 px-1 py-2 mb-1 overflow-hidden">
              <div className="w-8 h-8 shrink-0 border border-white/10 bg-[#c8b89a]/10 flex items-center justify-center text-xs font-medium text-[#c8b89a]">{userInitial}</div>
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.06em] text-white/70 truncate">{user.name || "Creator"}</div>
                <div className="text-[8.5px] text-white/25 truncate">{user.email}</div>
              </div>
            </div>
          )}
          <button onClick={() => logout.mutate()} title={collapsed ? "Sign Out" : undefined} className="w-full h-10 px-[10px] border border-transparent hover:border-red-500/10 hover:bg-red-500/5 text-white/30 hover:text-red-400 transition-all flex items-center gap-3 uppercase tracking-[0.18em] text-[10px]">
            <LogOut size={14} className="shrink-0" />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      <div className={`flex-1 min-h-screen flex flex-col relative z-[1] transition-[margin] duration-200 ${collapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"}`}>
        <header className="sticky top-0 z-10 h-[68px] bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.055] flex items-center justify-between px-8">
          <div className="flex items-center gap-2 uppercase tracking-[0.3em] text-[8.5px] text-white/30">
            <span>FormForge</span>
            <ChevronRight size={10} />
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span className="text-white/70">{currentLabel}</span>
          </div>
          <div className="h-8 px-4 border border-white/[0.07] text-[7.5px] uppercase tracking-[0.28em] text-white/35 flex items-center gap-2">
            <div className="w-[5px] h-[5px] bg-emerald-400 opacity-80" />
            {user.name || "Creator"}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">{children}</main>
      </div>
    </div>
  )
}
"use client"

import { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ChevronRight, Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react"
import { trpc } from "~/trpc/client"

const ease = [0.22, 1, 0.36, 1] as const

const transition = {
    duration: 0.55,
    ease,
}

function AuthPageContent() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const next = searchParams.get("next") ?? "/dashboard"

    const [isSignup, setIsSignup] = useState(pathname === "/signup")

    useEffect(() => {
        setIsSignup(pathname === "/signup")
    }, [pathname])

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    const login = trpc.auth.login.useMutation({
        onSuccess: () => router.push(next),
        onError: (e) => setError(e.message),
    })

    const signup = trpc.auth.signup.useMutation({
        onSuccess: () => router.push("/dashboard"),
        onError: (e) => setError(e.message),
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setError("")

        if (isSignup) {
            signup.mutate({
                name,
                email,
                password,
            })
        } else {
            login.mutate({
                email,
                password,
            })
        }
    }

    function toggleMode() {
        const nextMode = !isSignup

        setIsSignup(nextMode)

        router.push(nextMode ? "/signup" : "/login")
    }

    return (
        <div className="fixed inset-0 overflow-hidden bg-[#050505] text-[#f0ede8]">
            <div className="pointer-events-none absolute inset-0 z-0">
                <svg viewBox="0 0 1200 800" preserveAspectRatio="none" className="h-full w-full opacity-[0.018]">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M40 0H0v40" fill="none" stroke="#fff" strokeOpacity="0.25" />
                            <circle cx="6" cy="6" r="0.8" fill="#fff" opacity="0.35" />
                        </pattern>
                    </defs>

                    <rect width="1200" height="800" fill="url(#grid)" />
                </svg>
            </div>

            <main className="relative z-10 flex h-full w-full overflow-hidden">
                <section className="relative hidden flex-1 overflow-hidden border-r border-white/[0.055] px-12 pt-8 lg:flex">
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[30%] bg-gradient-to-t from-[#050505]/60 to-transparent" />

                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[52px] bg-repeat-x opacity-30 [background-image:url('/effects/floor.webp')] [background-size:auto_52px] [image-rendering:pixelated]" />

                    <motion.div
                        animate={{
                            x: isSignup ? -32 : 0,
                            scale: isSignup ? 1.04 : 1,
                        }}
                        transition={{
                            duration: 0.85,
                            ease,
                        }}
                        className="pointer-events-none absolute bottom-[48px] right-[14%] z-[3]"
                    >
                        <Image
                            src="https://shakanksh.com/shakanksh/shakanksh-walk.webp"
                            alt="character"
                            width={340}
                            height={340}
                            unoptimized
                            draggable={false}
                            className="h-[350px] w-auto object-contain [image-rendering:pixelated] transition-all duration-700 scale-x-100"
                        />
                    </motion.div>

                    <div className="relative z-[4] flex w-full flex-col justify-between">
                        <Link href="/" className="inline-flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center border border-white/[0.055] bg-[#0a0a0a]">
                                <Sparkles size={18} />
                            </div>

                            <div>
                                <div className="mb-1 text-[8px] uppercase tracking-[0.42em] text-white/30">
                                    Creator Terminal
                                </div>

                                <div className="font-serif text-[28px] font-black uppercase tracking-[0.04em]">
                                    FormForge
                                </div>
                            </div>
                        </Link>

                        <div className="flex max-w-[580px] flex-1 flex-col justify-center pb-[110px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isSignup ? "signup-hero" : "login-hero"}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -16 }}
                                    transition={transition}
                                >
                                    <div className="mb-5 text-[8px] uppercase tracking-[0.38em] text-white/35">
                                        {isSignup ? "Creator Registration" : "System Authentication"}
                                    </div>

                                    <h1 className="font-serif text-[72px] font-black uppercase leading-[0.88] tracking-[-0.03em] xl:text-[78px]">
                                        {isSignup ? (
                                            <>
                                                CREATE
                                                <br />
                                                CREATOR
                                                <br />
                                                ACCOUNT
                                            </>
                                        ) : (
                                            <>
                                                ACCESS
                                                <br />
                                                CREATOR
                                                <br />
                                                TERMINAL
                                            </>
                                        )}
                                    </h1>

                                    <p className="mt-6 max-w-[460px] text-[11px] leading-[1.9] tracking-[0.02em] text-white/40">
                                        {isSignup
                                            ? "Launch your creator workspace and build cinematic form experiences."
                                            : "Manage workflows, responses and creator infrastructure from the terminal."}
                                    </p>

                                    <div className="mt-7 h-px w-12 bg-[#c8b89a]/40" />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="relative z-[4] flex items-center justify-between border-t border-white/[0.055] py-4">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/35">
                                AAA Interface / Version 2.0
                            </span>

                            <div className="flex items-center gap-2">
                                <div className="h-[5px] w-[5px] bg-[#4caf82] opacity-70" />

                                <span className="text-[8px] uppercase tracking-[0.3em] text-white/35">
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex w-full items-start justify-center overflow-hidden px-7 py-5 lg:w-[420px] lg:items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignup ? "signup-card" : "login-card"}
                            initial={{
                                opacity: 0,
                                rotateY: isSignup ? -75 : 75,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                rotateY: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                rotateY: isSignup ? 75 : -75,
                                scale: 0.97,
                            }}
                            transition={{
                                duration: 0.72,
                                ease,
                            }}
                            className="relative w-full max-w-[360px] rounded-[2px] border border-white/[0.055] bg-[#070707]/95 px-7 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8b89a]/30 to-transparent" />

                            <div className="space-y-1">
                                <div className="mb-3 text-[7.5px] uppercase tracking-[0.36em] text-white/35">
                                    Authentication
                                </div>

                                <h2 className="font-serif text-[46px] font-black uppercase leading-[0.9] tracking-[-0.02em]">
                                    {isSignup ? "Sign Up" : "Sign In"}
                                </h2>

                                <p className="mt-3 text-[10.5px] leading-[1.8] tracking-[0.02em] text-white/40">
                                    {isSignup
                                        ? "Create your creator account and enter the system."
                                        : "Enter credentials to access the creator system."}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                <AnimatePresence>
                                    {isSignup && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={transition}
                                            className="overflow-hidden"
                                        >
                                            <label className="mb-2.5 block text-[7.5px] uppercase tracking-[0.3em] text-white/35">
                                                Creator Name
                                            </label>

                                            <div className="relative">
                                                <User
                                                    size={14}
                                                    className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-white/20"
                                                />

                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required={isSignup}
                                                    placeholder="Ankur Kumawat"
                                                    className="h-[50px] w-full border border-white/[0.055] bg-[#0e0e0e] pl-[42px] pr-[14px] text-[12px] tracking-[0.04em] text-[#f0ede8] outline-none transition-all placeholder:text-white/15 focus:border-white/20 focus:bg-[#121212]"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <label className="mb-2.5 block text-[7.5px] uppercase tracking-[0.3em] text-white/35">
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={14}
                                            className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-white/20"
                                        />

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="creator@formforge.dev"
                                            className="h-[50px] w-full border border-white/[0.055] bg-[#0e0e0e] pl-[42px] pr-[14px] text-[12px] tracking-[0.04em] text-[#f0ede8] outline-none transition-all placeholder:text-white/15 focus:border-white/20 focus:bg-[#121212]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2.5 block text-[7.5px] uppercase tracking-[0.3em] text-white/35">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <Lock
                                            size={14}
                                            className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-white/20"
                                        />

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="h-[50px] w-full border border-white/[0.055] bg-[#0e0e0e] pl-[42px] pr-[42px] text-[12px] tracking-[0.04em] text-[#f0ede8] outline-none transition-all placeholder:text-white/15 focus:border-white/20 focus:bg-[#121212]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((s) => !s)}
                                            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-white/20 transition-all hover:text-white/50"
                                        >
                                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="border border-red-500/10 bg-red-500/5 px-[14px] py-[10px] text-[11px] leading-[1.6] tracking-[0.02em] text-red-300">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={login.isPending || signup.isPending}
                                    className="mt-1 flex h-[50px] w-full items-center justify-center gap-2 bg-[#f0ede8] text-[10px] font-medium uppercase tracking-[0.32em] text-[#050505] transition-all hover:bg-white active:scale-[0.997] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {login.isPending || signup.isPending
                                        ? "LOADING..."
                                        : isSignup
                                            ? "CREATE ACCOUNT"
                                            : "ENTER SYSTEM"}

                                    <ArrowRight size={13} />
                                </button>
                            </form>

                            <div className="mt-5 flex items-center justify-between gap-3 border border-white/[0.055] bg-black/30 px-5 py-4">
                                <div>
                                    <div className="mb-[5px] text-[7px] uppercase tracking-[0.32em] text-white/35">
                                        {isSignup ? "Already Registered" : "New Creator"}
                                    </div>

                                    <h3 className="font-serif text-[18px] font-black uppercase leading-none tracking-[-0.01em]">
                                        {isSignup ? "Sign In" : "Sign Up"}
                                    </h3>

                                    <p className="mt-1 text-[9.5px] leading-[1.6] tracking-[0.02em] text-white/40">
                                        {isSignup ? "Continue building forms." : "Start your workspace."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="flex h-[38px] min-w-[100px] flex-shrink-0 items-center justify-center gap-1.5 border border-white/10 bg-white/95 px-4 text-[9px] font-medium uppercase tracking-[0.28em] text-[#050505] transition-all hover:bg-white"
                                >
                                    {isSignup ? "SIGN IN" : "SIGN UP"}

                                    <ArrowRight size={11} />
                                </button>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-white/[0.055] pt-[14px]">
                                <span className="text-[8px] uppercase tracking-[0.26em] text-white/35">
                                    FormForge
                                </span>

                                <div className="flex items-center gap-1 text-white/35">
                                    <ChevronRight size={11} />

                                    <span className="text-[8px] uppercase tracking-[0.26em]">
                                        {isSignup ? "Creator Access" : "Secure Access"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </section>
            </main>
        </div>
    )
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="bg-black h-screen w-full" />}>
            <AuthPageContent />
        </Suspense>
    )
}
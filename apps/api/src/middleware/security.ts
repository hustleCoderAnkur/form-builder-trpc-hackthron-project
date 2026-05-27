import type { Request, Response, NextFunction } from "express"
import cors from "cors"

const ALLOWED_ORIGINS = [
  process.env.WEB_URL ?? "https://form-builder-trpc-hackthron-project.vercel.app/",
  process.env.API_BASE_URL ?? "https://form-builder-trpc-hackthron-project.vercel.app/",
].filter(Boolean)

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
})

const BLOCKED_UA = [/sqlmap/i, /nikto/i, /masscan/i]

export function blockBadActors(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ua = req.headers["user-agent"] ?? ""
  if (BLOCKED_UA.some((p) => p.test(ua))) {
    return res.status(403).json({ error: "Forbidden" })
  }
  next()
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err.message.startsWith("CORS blocked")) {
    return res.status(403).json({ error: "CORS policy violation" })
  }
  console.error("[api]", err.message)
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  })
}

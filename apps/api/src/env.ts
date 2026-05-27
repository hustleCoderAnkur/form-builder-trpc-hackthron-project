import { z } from "zod"

const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test", "prod"]).default("development"),
  BASE_URL: z.string().default("https://form-builder-trpc-hackthron-project-1.onrender.com"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  DATABASE_URL: z.string().url().optional(),
  WEB_URL: z.string().url().optional(),
})

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env)
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message)
  return safeParseResult.data
}

export const env = createEnv(process.env)

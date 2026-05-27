import type { Request, Response, NextFunction } from "express"
import { RATE_LIMITS } from "@repo/shared"
import { rateLimitCheck as memoryCheck } from "@repo/services/utils/rate-limit"

class UpstashRedis {
  constructor(
    private url = process.env.UPSTASH_REDIS_REST_URL!,
    private token = process.env.UPSTASH_REDIS_REST_TOKEN!,
  ) {}

  private async cmd<T>(...args: (string | number)[]): Promise<T> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    })
    const json = (await res.json()) as { result?: T; error?: string }
    if (json.error) throw new Error(json.error)
    return json.result as T
  }

  incr(key: string) {
    return this.cmd<number>("INCR", key)
  }
  expire(key: string, secs: number) {
    return this.cmd<number>("EXPIRE", key, secs)
  }
  ttl(key: string) {
    return this.cmd<number>("TTL", key)
  }
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? new UpstashRedis() : null

export type RateLimitOptions = {
  key: string
  max: number
  windowMs: number
}

export async function checkRateLimit(
  ip: string,
  opts: RateLimitOptions,
): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
  const redisKey = `rl:${opts.key}:${ip}`
  const windowSecs = Math.ceil(opts.windowMs / 1000)

  if (!redis) {
    const r = memoryCheck(redisKey, opts)
    return {
      allowed: r.allowed,
      remaining: r.allowed ? opts.max - 1 : 0,
      retryAfter: Math.ceil(r.retryAfterMs / 1000),
    }
  }

  try {
    const count = await redis.incr(redisKey)
    if (count === 1) await redis.expire(redisKey, windowSecs)
    if (count > opts.max) {
      const ttl = await redis.ttl(redisKey)
      return { allowed: false, remaining: 0, retryAfter: ttl }
    }
    return { allowed: true, remaining: opts.max - count, retryAfter: 0 }
  } catch {
    return { allowed: true, remaining: opts.max, retryAfter: 0 }
  }
}

export function rateLimitMiddleware(opts: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const forwarded = req.headers["x-forwarded-for"]
    const ip = Array.isArray(forwarded)
      ? forwarded[0]!
      : typeof forwarded === "string"
        ? forwarded.split(",")[0]!.trim()
        : req.socket.remoteAddress ?? "unknown"

    const result = await checkRateLimit(ip, opts)

    res.setHeader("X-RateLimit-Limit", opts.max)
    res.setHeader("X-RateLimit-Remaining", result.remaining)

    if (!result.allowed) {
      res.setHeader("Retry-After", result.retryAfter)
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: result.retryAfter,
      })
    }
    next()
  }
}

export { RATE_LIMITS }

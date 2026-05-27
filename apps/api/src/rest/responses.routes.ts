import { Router } from "express"
import { rateLimitMiddleware, RATE_LIMITS } from "../middleware/rate-limit"
import { submitResponse } from "@repo/services/response.service"
import { getPublicFormBySlug } from "@repo/services/form.service"
import { sanitizeAnswers } from "@repo/services/utils/sanitize"

const router = Router({ mergeParams: true })

router.post(
  "/",
  rateLimitMiddleware({ key: "rest-submit", ...RATE_LIMITS.formSubmit }),
  async (req, res) => {
    try {
      const { answers, respondentEmail } = req.body ?? {}
      if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
        return res.status(400).json({
          error: "Bad request",
          message: "answers must be an object",
          code: 400,
        })
      }
      const slug = Array.isArray(req.params.slug)
        ? req.params.slug[0]
        : req.params.slug

      if (!slug) {
        throw new Error("Slug is required")
      }

      const form = await getPublicFormBySlug(slug)
      const result = await submitResponse({
        formId: form.id,
        answers: sanitizeAnswers(answers) as Record<string, unknown>,
        respondentEmail,
        meta: {
          userAgent: req.headers["user-agent"],
          referrer: (req.headers.referer ?? req.headers.referrer) as string | undefined,
        },
      })

      res.status(201).json(result)
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string }
      if (e.code === "NOT_FOUND") {
        return res.status(404).json({ error: "Not found", message: e.message, code: 404 })
      }
      if (e.code === "BAD_REQUEST") {
        return res.status(400).json({ error: "Validation failed", message: e.message, code: 400 })
      }
      res.status(500).json({ error: "Internal server error", code: 500 })
    }
  },
)

export default router

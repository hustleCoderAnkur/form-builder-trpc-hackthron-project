import { Router } from "express"
import { getPublicFormBySlug, getPublicForms } from "@repo/services/form.service"
import { getFieldsByForm } from "@repo/services/field.service"

const router = Router()

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit ?? 20), 10) || 20, 50)
    const offset = parseInt(String(req.query.offset ?? 0), 10) || 0
    const forms = await getPublicForms(limit, offset)
    res.json({ forms, total: forms.length })
  } catch {
    res.status(500).json({ error: "Internal server error", code: 500 })
  }
})

router.get("/:slug", async (req, res) => {
  try {
    const form = await getPublicFormBySlug(req.params.slug!)
    const fields = await getFieldsByForm(form.id)
    res.json({ ...form, fields })
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string }
    if (e.code === "NOT_FOUND") {
      return res.status(404).json({ error: "Not found", message: e.message, code: 404 })
    }
    res.status(500).json({ error: "Internal server error", code: 500 })
  }
})

export default router

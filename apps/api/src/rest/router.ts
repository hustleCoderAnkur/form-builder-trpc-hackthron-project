import { Router } from "express"
import formsRouter from "./forms.routes"
import responsesRouter from "./responses.routes"

const router = Router()
router.use("/forms", formsRouter)
router.use("/forms/:slug/responses", responsesRouter)
export default router

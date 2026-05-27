import express from "express"
import cookieParser from "cookie-parser"
import * as trpcExpress from "@trpc/server/adapters/express"
import { apiReference } from "@scalar/express-api-reference"
import { appRouter, createContext } from "@repo/trpc"
import { corsMiddleware, blockBadActors, errorHandler } from "./middleware/security"
import { buildOpenApiSpec } from "./openapi/spec"
import restRouter from "./rest/router"

export const app = express()

app.use(corsMiddleware)
app.use(express.json({ limit: "100kb" }))
app.use(cookieParser())
app.use(blockBadActors)

app.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: Date.now(), version: "1.0.0" })
})

app.get("/openapi.json", (_req, res) => {
  res.json(buildOpenApiSpec())
})

app.use("/docs", apiReference({ url: "/openapi.json", theme: "saturn" }))

app.use("/api/v1", restRouter)

app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter, createContext }))

app.use(errorHandler)

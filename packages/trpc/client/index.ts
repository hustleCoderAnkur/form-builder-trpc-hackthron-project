import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "../server/routers/index.js";

export type ServerRouter = AppRouter;

export type RouterOutputs = inferRouterOutputs<ServerRouter>;
export type RouterInputs = inferRouterInputs<ServerRouter>;

export type { AppRouter };

export * from "@trpc/client";

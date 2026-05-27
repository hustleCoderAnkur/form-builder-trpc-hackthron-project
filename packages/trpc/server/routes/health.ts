import { router, publicProcedure } from "../trpc.js";

export const healthRouter = router({
  check: publicProcedure.query(() => ({
    status: "ok" as const,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
  })),
});

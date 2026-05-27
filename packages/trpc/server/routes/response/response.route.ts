import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../../trpc.js";
import {
  submitResponse,
  getResponsesByForm,
  getResponseWithAnswers,
} from "@repo/services/response.service";
import { rateLimitCheck } from "@repo/services/utils/rate-limit";
import {
  submitResponseSchema,
  formIdSchema,
  responseIdSchema,
} from "./schemas.js";

function getClientIp(req: {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (Array.isArray(forwarded)) return forwarded[0] ?? "unknown";
  if (typeof forwarded === "string") return forwarded.split(",")[0]!.trim();
  return req.socket?.remoteAddress ?? "unknown";
}

export const responseRouter = router({
  submit: publicProcedure
    .input(submitResponseSchema)
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.req);
      const { allowed, retryAfterMs } = rateLimitCheck(`submit:${ip}`, {
        max: 5,
        windowMs: 60_000,
      });

      if (!allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Too many submissions. Try again in ${Math.ceil(retryAfterMs / 1000)}s`,
        });
      }

      const ua = ctx.req.headers["user-agent"];
      const ref = ctx.req.headers["referer"] ?? ctx.req.headers["referrer"];

      return submitResponse({
        ...input,
        meta: {
          userAgent: typeof ua === "string" ? ua : undefined,
          referrer: typeof ref === "string" ? ref : undefined,
        },
      });
    }),

  listByForm: protectedProcedure
    .input(formIdSchema)
    .query(({ input, ctx }) =>
      getResponsesByForm(input.formId, ctx.user.id),
    ),

  detail: protectedProcedure
    .input(responseIdSchema)
    .query(({ input, ctx }) =>
      getResponseWithAnswers(input.responseId, ctx.user.id),
    ),
});

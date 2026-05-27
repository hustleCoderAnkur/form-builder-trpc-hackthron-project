import { router, protectedProcedure } from "../../trpc.js";
import {
  getFormOverview,
  getSubmissionTrend,
  getFieldAnalytics,
  getPaginatedResponses,
  getExportData,
} from "@repo/services/analytics.service";
import { formIdSchema, paginatedSchema } from "./schemas.js";

export const analyticsRouter = router({
  overview: protectedProcedure
    .input(formIdSchema)
    .query(({ input, ctx }) => getFormOverview(input.formId, ctx.user.id)),

  trend: protectedProcedure
    .input(formIdSchema)
    .query(({ input, ctx }) => getSubmissionTrend(input.formId, ctx.user.id)),

  fields: protectedProcedure
    .input(formIdSchema)
    .query(({ input, ctx }) => getFieldAnalytics(input.formId, ctx.user.id)),

  responses: protectedProcedure
    .input(paginatedSchema)
    .query(({ input, ctx }) =>
      getPaginatedResponses(
        input.formId,
        ctx.user.id,
        input.page,
        input.limit,
      ),
    ),

  export: protectedProcedure
    .input(formIdSchema)
    .query(({ input, ctx }) => getExportData(input.formId, ctx.user.id)),
});

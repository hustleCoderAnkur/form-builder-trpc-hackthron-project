import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  router,
  publicProcedure,
  protectedProcedure,
} from "../../trpc.js";

import {
  createForm,
  getFormsByUser,
  getFormById,
  getPublicFormBySlug,
  getPublicForms,
  updateForm,
  publishForm,
  unpublishForm,
  deleteForm,
} from "@repo/services/form.service";

import { getFieldsByForm } from "@repo/services/field.service";

import {
  getResponsesByForm,
} from "@repo/services/response.service";

import { getThemeById } from "@repo/services/theme.service";

import {
  createFormSchema,
  updateFormSchema,
  formIdSchema,
  publicBySlugSchema,
  exploreSchema,
} from "./schemas.js";

export const formRouter = router({
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(({ input, ctx }) =>
      createForm({
        userId: ctx.user.id,
        ...input,
      }),
    ),

  list: protectedProcedure.query(
    ({ ctx }) =>
      getFormsByUser(ctx.user.id),
  ),

  byId: protectedProcedure
    .input(formIdSchema)
    .query(({ input, ctx }) =>
      getFormById(
        input.formId,
        ctx.user.id,
      ),
    ),

  withFields: protectedProcedure
    .input(formIdSchema)
    .query(async ({ input, ctx }) => {
      const form = await getFormById(
        input.formId,
        ctx.user.id,
      );

      const fields =
        await getFieldsByForm(
          input.formId,
        );

      return {
        form,
        fields,
      };
    }),

  update: protectedProcedure
    .input(updateFormSchema)
    .mutation(({ input, ctx }) => {
      const { formId, ...data } =
        input;

      return updateForm(
        formId,
        ctx.user.id,
        data,
      );
    }),

  publish: protectedProcedure
    .input(formIdSchema)
    .mutation(({ input, ctx }) =>
      publishForm(
        input.formId,
        ctx.user.id,
      ),
    ),

  unpublish: protectedProcedure
    .input(formIdSchema)
    .mutation(({ input, ctx }) =>
      unpublishForm(
        input.formId,
        ctx.user.id,
      ),
    ),

  delete: protectedProcedure
    .input(formIdSchema)
    .mutation(({ input, ctx }) =>
      deleteForm(
        input.formId,
        ctx.user.id,
      ),
    ),

  publicBySlug: publicProcedure
    .input(publicBySlugSchema)
    .query(async ({ input }) => {
      const form =
        await getPublicFormBySlug(
          input.slug,
        );

      const fields =
        await getFieldsByForm(
          form.id,
        );

      const theme = form.themeId
        ? await getThemeById(
          form.themeId,
        ).catch(() => null)
        : null;

      return {
        form,
        fields,
        theme,
      };
    }),

  analytics: protectedProcedure
    .input(formIdSchema)
    .query(async ({ input, ctx }) => {
      const form = await getFormById(
        input.formId,
        ctx.user.id,
      );

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      const responses =
        await getResponsesByForm(
          input.formId,
          ctx.user.id,
        );

      const totalSubmissions =
        responses.length;

      // Fake calculated views for now
      // until real tracking exists
      const totalViews = Math.max(
        totalSubmissions * 3,
        1,
      );

      const conversionRate =
        totalViews > 0
          ? Number(
            (
              (totalSubmissions /
                totalViews) *
              100
            ).toFixed(1),
          )
          : 0;

      const submissionChartData =
        Array.from(
          { length: 7 },
          (_, i) => {
            const date = new Date();

            date.setDate(
              date.getDate() -
              (6 - i),
            );

            const label =
              date.toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                },
              );

            const count =
              responses.filter(
                (r) => {
                  if (
                    !r.submittedAt
                  ) {
                    return false;
                  }

                  const submittedDate =
                    new Date(
                      r.submittedAt,
                    );

                  return (
                    submittedDate.toDateString() ===
                    date.toDateString()
                  );
                },
              ).length;

            return {
              date: label,
              submissions: count,
              views: Math.max(
                count * 3,
                1,
              ),
            };
          },
        );

      return {
        totalSubmissions,

        totalViews,

        conversionRate,

        averageCompletion:
          "1m 42s",

        recentResponses:
          responses.map((r) => ({
            id: r.id,

            respondentEmail:
              r.respondentEmail,

            submittedAt:
              r.submittedAt,

            status: r.status,
          })),

        submissionChartData,

        deviceData: [
          {
            name: "Desktop",
            value: 64,
          },
          {
            name: "Mobile",
            value: 28,
          },
          {
            name: "Tablet",
            value: 8,
          },
        ],

        sourceData: [
          {
            source: "Direct",
            count: 45,
          },
          {
            source: "Twitter",
            count: 21,
          },
          {
            source: "Discord",
            count: 13,
          },
          {
            source: "LinkedIn",
            count: 8,
          },
        ],
      };
    }),

  explore: publicProcedure
    .input(exploreSchema)
    .query(({ input }) =>
      getPublicForms(
        input.limit,
        input.offset,
      ),
    ),
});
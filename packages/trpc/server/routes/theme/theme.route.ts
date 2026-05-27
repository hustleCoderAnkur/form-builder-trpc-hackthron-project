import { z } from "zod";

import {
  router,
  publicProcedure,
  protectedProcedure,
} from "../../trpc.js";

import {
  getThemeGallery,
  getThemesForUser,
  applyThemeToForm,
  createUserTheme,
} from "@repo/services/theme.service";

export const themeConfigSchema = z.object({
  primaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  accentColor: z.string(),
  fontFamily: z.string(),

  borderRadius: z.enum([
    "none",
    "sm",
    "md",
    "lg",
    "full",
  ]),

  backgroundImage: z.string().optional(),
  logoUrl: z.string().optional(),
});

export type ThemeConfig = z.infer<
  typeof themeConfigSchema
>;

export const themeRouter = router({
  gallery: publicProcedure.query(() =>
    getThemeGallery(),
  ),

  list: protectedProcedure.query(({ ctx }) =>
    getThemesForUser(ctx.user.id),
  ),

  applyTheme: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
        themeId: z.string().uuid().nullable(),
      }),
    )
    .mutation(({ input, ctx }) =>
      applyThemeToForm(
        input.formId,
        ctx.user.id,
        input.themeId,
      ),
    ),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(80),

        category: z
          .string()
          .max(40)
          .optional(),

        config: themeConfigSchema,
      }),
    )
    .mutation(({ input, ctx }) =>
      createUserTheme({
        userId: ctx.user.id,
        ...input,
      }),
    ),
});
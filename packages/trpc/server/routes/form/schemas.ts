import { z } from "zod";

export const createFormSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
});

export const updateFormSchema = z.object({
  formId: z.string().uuid(),
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(2000).optional(),
  visibility: z.enum(["public", "unlisted"]).optional(),
  themeId: z.string().uuid().nullable().optional(),
});

export const formIdSchema = z.object({
  formId: z.string().uuid(),
});

export const publicBySlugSchema = z.object({
  slug: z.string().min(1).max(80),
});

export const exploreSchema = z.object({
  limit: z.number().int().min(1).max(50).default(20),
  offset: z.number().int().min(0).default(0),
});

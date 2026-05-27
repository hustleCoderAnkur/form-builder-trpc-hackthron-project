import { z } from "zod";

export const formIdSchema = z.object({
  formId: z.string().uuid(),
});

export const paginatedSchema = z.object({
  formId: z.string().uuid(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

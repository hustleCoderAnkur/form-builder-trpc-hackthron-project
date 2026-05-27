import { z } from "zod";

export const submitResponseSchema = z.object({
  formId: z.string().uuid(),
  answers: z.record(
    z.string().uuid(),
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.string()),
    ]),
  ),
  respondentEmail: z.string().email().optional(),
});

export const formIdSchema = z.object({
  formId: z.string().uuid(),
});

export const responseIdSchema = z.object({
  responseId: z.string().uuid(),
});

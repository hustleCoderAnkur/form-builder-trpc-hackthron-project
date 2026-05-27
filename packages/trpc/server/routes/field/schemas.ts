import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "short_text",
  "long_text",
  "email",
  "number",
  "phone",
  "url",
  "date",
  "time",
  "select",
  "multi_select",
  "radio",
  "checkbox",
  "rating",
  "scale",
  "file_upload",
  "section",
]);

const selectOptionSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
});

export const validationConfigSchema = z
  .object({
    required: z.boolean().optional(),
    errorMessage: z.string().max(200).optional(),
    minLength: z.number().int().min(0).optional(),
    maxLength: z.number().int().max(5000).optional(),
    pattern: z.string().max(200).optional(),
    placeholder: z.string().max(200).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    options: z.array(selectOptionSchema).max(20).optional(),
    allowOther: z.boolean().optional(),
    maxSizeMb: z.number().max(50).optional(),
    allowedTypes: z.array(z.string()).max(10).optional(),
    maxFiles: z.number().int().max(10).optional(),
    labels: z
      .object({
        start: z.string().max(50).optional(),
        end: z.string().max(50).optional(),
      })
      .optional(),
  })
  .optional();

export const addFieldSchema = z.object({
  formId: z.string().uuid(),
  type: fieldTypeSchema,
  label: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  isRequired: z.boolean().default(false),
  validationConfig: validationConfigSchema,
  order: z.number().int().min(0).optional(),
});

export const updateFieldSchema = z.object({
  fieldId: z.string().uuid(),
  formId: z.string().uuid(),
  label: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  isRequired: z.boolean().optional(),
  validationConfig: validationConfigSchema,
  order: z.number().int().min(0).optional(),
});

export const deleteFieldSchema = z.object({
  fieldId: z.string().uuid(),
  formId: z.string().uuid(),
});

export const reorderFieldsSchema = z.object({
  formId: z.string().uuid(),
  orderedIds: z.array(z.string().uuid()),
});

export const listFieldsSchema = z.object({
  formId: z.string().uuid(),
});

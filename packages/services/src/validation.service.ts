import { z } from "zod";
import type { FormField, FieldValidation } from "@formbit/database";

const SKIP_TYPES = new Set(["section", "file_upload"]);

function config(field: FormField): FieldValidation {
  return (field.validationConfig ?? {}) as FieldValidation;
}

export function buildFormSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (SKIP_TYPES.has(field.type)) continue;

    let validator: z.ZodTypeAny;
    const v = config(field);

    switch (field.type) {
      case "short_text":
      case "long_text":
      case "phone": {
        let s = z.string();
        if ("minLength" in v && v.minLength != null) {
          s = s.min(v.minLength, `Minimum ${v.minLength} characters`);
        }
        if ("maxLength" in v && v.maxLength != null) {
          s = s.max(v.maxLength, `Maximum ${v.maxLength} characters`);
        }
        validator = s;
        break;
      }
      case "url": {
        let s = z.string().url("Enter a valid URL");
        if ("maxLength" in v && v.maxLength != null) {
          s = s.max(v.maxLength);
        }
        validator = s;
        break;
      }
      case "email":
        validator = z.string().email("Enter a valid email");
        break;
      case "number":
      case "scale": {
        let n = z.coerce.number();
        if ("min" in v && v.min != null) n = n.min(v.min);
        if ("max" in v && v.max != null) n = n.max(v.max);
        validator = n;
        break;
      }
      case "date":
      case "time":
        validator = z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
          message: "Enter a valid date/time",
        });
        break;
      case "select":
      case "radio": {
        const opts =
          "options" in v && v.options?.length
            ? v.options.map((o) => o.value)
            : [];
        validator =
          opts.length > 0
            ? z.enum(opts as [string, ...string[]])
            : z.string().min(1);
        break;
      }
      case "multi_select": {
        const opts =
          "options" in v && v.options?.length
            ? v.options.map((o) => o.value)
            : [];
        validator =
          opts.length > 0
            ? z.array(z.enum(opts as [string, ...string[]]))
            : z.array(z.string());
        break;
      }
      case "checkbox":
        validator = z.boolean();
        break;
      case "rating": {
        const max = "max" in v && v.max != null ? v.max : 5;
        const min = "min" in v && v.min != null ? v.min : 1;
        validator = z.coerce.number().int().min(min).max(max);
        break;
      }
      default:
        validator = z.string();
    }

    shape[field.id] = field.isRequired ? validator : validator.optional();
  }

  return z.object(shape);
}

import { db, formFields, type FieldType, type FieldValidation } from "@formbit/database";
import { and, asc, count, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getFormById } from "./form.service";

const MAX_FIELDS_PER_FORM = 50;

export async function getFieldsByForm(formId: string) {
  return db
    .select()
    .from(formFields)
    .where(eq(formFields.formId, formId))
    .orderBy(asc(formFields.order));
}

export async function addField(
  formId: string,
  userId: string,
  input: {
    type: FieldType;
    label: string;
    description?: string;
    isRequired?: boolean;
    validationConfig?: FieldValidation;
    order?: number;
  },
) {
  await getFormById(formId, userId);

  const [countRow] = await db
    .select({ total: count() })
    .from(formFields)
    .where(eq(formFields.formId, formId));

  const total = Number(countRow?.total ?? 0);

  if (total >= MAX_FIELDS_PER_FORM) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Maximum ${MAX_FIELDS_PER_FORM} fields per form`,
    });
  }

  const [field] = await db
    .insert(formFields)
    .values({
      formId,
      type: input.type,
      label: input.label,
      description: input.description,
      isRequired: input.isRequired ?? false,
      validationConfig: input.validationConfig ?? {},
      order: input.order ?? total,
    })
    .returning();

  return field!;
}

export async function updateField(
  fieldId: string,
  userId: string,
  formId: string,
  data: Partial<{
    label: string;
    description: string;
    isRequired: boolean;
    validationConfig: FieldValidation;
    order: number;
    conditionalLogic: (typeof formFields.$inferSelect)["conditionalLogic"];
  }>,
) {
  await getFormById(formId, userId);

  const [updated] = await db
    .update(formFields)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(formFields.id, fieldId), eq(formFields.formId, formId)))
    .returning();

  if (!updated) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });
  }
  return updated;
}

export async function deleteField(
  fieldId: string,
  userId: string,
  formId: string,
) {
  await getFormById(formId, userId);

  const [deleted] = await db
    .delete(formFields)
    .where(and(eq(formFields.id, fieldId), eq(formFields.formId, formId)))
    .returning({ id: formFields.id });

  if (!deleted) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });
  }
  return { success: true };
}

export async function reorderFields(
  formId: string,
  userId: string,
  orderedIds: string[],
) {
  await getFormById(formId, userId);

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(formFields)
        .set({ order: index, updatedAt: new Date() })
        .where(and(eq(formFields.id, id), eq(formFields.formId, formId))),
    ),
  );

  return { success: true };
}
import {
  db,
  forms,
  formResponses,
  responseAnswers,
  type AnswerValue,
} from "@formbit/database";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getFieldsByForm } from "./field.service";
import { buildFormSchema } from "./validation.service";
import { sanitizeAnswers } from "./utils/sanitize";
import { sendResponseNotification } from "./email.service";

export type AnswerMap = Record<string, unknown>;

async function assertPublishedForm(formId: string) {
  const [form] = await db
    .select()
    .from(forms)
    .where(
      and(
        eq(forms.id, formId),
        eq(forms.status, "published"),
        isNull(forms.deletedAt),
      ),
    )
    .limit(1);

  if (!form) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Form not available",
    });
  }

  if (form.expiresAt && form.expiresAt < new Date()) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This form has expired",
    });
  }

  if (form.responseLimitCount != null) {
    const [countRow] = await db
      .select({ total: count() })
      .from(formResponses)
      .where(eq(formResponses.formId, formId));
    if (Number(countRow?.total ?? 0) >= form.responseLimitCount) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This form is no longer accepting responses",
      });
    }
  }

  return form;
}

export async function submitResponse(input: {
  formId: string;
  answers: AnswerMap;
  respondentEmail?: string;
  meta?: { userAgent?: string; referrer?: string };
}) {
  const form = await assertPublishedForm(input.formId);
  const fields = await getFieldsByForm(input.formId);
  const cleaned = sanitizeAnswers(input.answers);
  const schema = buildFormSchema(fields);
  const parsed = schema.safeParse(cleaned);

  if (!parsed.success) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Validation failed",
      cause: parsed.error.flatten(),
    });
  }

  const [response] = await db
    .insert(formResponses)
    .values({
      formId: input.formId,
      status: "submitted",
      respondentEmail: input.respondentEmail?.trim().toLowerCase(),
      submittedAt: new Date(),
      userAgent: input.meta?.userAgent,
      referrer: input.meta?.referrer,
    })
    .returning();

  const fieldMap = new Map(fields.map((f) => [f.id, f]));
  const rows = Object.entries(parsed.data)
    .filter(([, val]) => val !== undefined)
    .map(([fieldId, val]) => {
      const field = fieldMap.get(fieldId)!;
      return {
        responseId: response!.id,
        fieldId,
        fieldLabel: field.label,
        fieldType: field.type,
        value: val as AnswerValue,
      };
    });

  if (rows.length > 0) {
    await db.insert(responseAnswers).values(rows);
  }

  sendResponseNotification({
    creatorId: form.createdBy,
    formTitle: form.title,
    responseId: response!.id,
    respondentEmail: input.respondentEmail,
  }).catch(() => {});

  return { responseId: response!.id, success: true };
}

export async function getResponsesByForm(formId: string, userId: string) {
  const [form] = await db
    .select({ createdBy: forms.createdBy })
    .from(forms)
    .where(and(eq(forms.id, formId), isNull(forms.deletedAt)))
    .limit(1);

  if (!form || form.createdBy !== userId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return db
    .select()
    .from(formResponses)
    .where(eq(formResponses.formId, formId))
    .orderBy(desc(formResponses.submittedAt));
}

export async function getResponseWithAnswers(
  responseId: string,
  userId: string,
) {
  const [response] = await db
    .select()
    .from(formResponses)
    .where(eq(formResponses.id, responseId))
    .limit(1);

  if (!response) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const [form] = await db
    .select({ createdBy: forms.createdBy })
    .from(forms)
    .where(eq(forms.id, response.formId))
    .limit(1);

  if (!form || form.createdBy !== userId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const answers = await db
    .select()
    .from(responseAnswers)
    .where(eq(responseAnswers.responseId, responseId));

  return { response, answers };
}

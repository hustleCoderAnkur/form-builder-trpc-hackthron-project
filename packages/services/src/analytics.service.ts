import {
  db,
  forms,
  formResponses,
  responseAnswers,
  formFields,
} from "@formbit/database";
import { and, count, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

async function assertFormOwner(formId: string, userId: string) {
  const [form] = await db
    .select({ id: forms.id })
    .from(forms)
    .where(
      and(
        eq(forms.id, formId),
        eq(forms.createdBy, userId),
        isNull(forms.deletedAt),
      ),
    )
    .limit(1);

  if (!form) throw new TRPCError({ code: "FORBIDDEN" });
}

const CHOICE_TYPES = new Set([
  "select",
  "multi_select",
  "radio",
  "checkbox",
  "rating",
  "scale",
]);

export async function getFormOverview(formId: string, userId: string) {
  await assertFormOwner(formId, userId);

  const [totalRow] = await db
    .select({ total: count() })
    .from(formResponses)
    .where(eq(formResponses.formId, formId));

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recentRow] = await db
    .select({ recent: count() })
    .from(formResponses)
    .where(
      and(
        eq(formResponses.formId, formId),
        gte(formResponses.submittedAt, sevenDaysAgo),
      ),
    );

  const [fieldCountRow] = await db
    .select({ total: count() })
    .from(formFields)
    .where(eq(formFields.formId, formId));

  const totalResponses = Number(totalRow?.total ?? 0);
  const recentResponses = Number(recentRow?.recent ?? 0);

  return {
    totalResponses,
    recentResponses,
    totalFields: Number(fieldCountRow?.total ?? 0),
    avgResponsesPerDay:
      totalResponses > 0
        ? parseFloat((totalResponses / 30).toFixed(2))
        : 0,
  };
}

export async function getSubmissionTrend(formId: string, userId: string) {
  await assertFormOwner(formId, userId);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await db
    .select({
      date: sql<string>`DATE(${formResponses.submittedAt})`.as("date"),
      count: sql<number>`COUNT(*)::int`.as("count"),
    })
    .from(formResponses)
    .where(
      and(
        eq(formResponses.formId, formId),
        gte(formResponses.submittedAt, thirtyDaysAgo),
      ),
    )
    .groupBy(sql`DATE(${formResponses.submittedAt})`)
    .orderBy(sql`DATE(${formResponses.submittedAt})`);

  return fillMissingDays(rows, thirtyDaysAgo);
}

function fillMissingDays(
  rows: { date: string; count: number }[],
  from: Date,
) {
  const map = new Map(rows.map((r) => [r.date, r.count]));
  const result: { date: string; count: number }[] = [];
  const cursor = new Date(from);
  const today = new Date();

  while (cursor <= today) {
    const key = cursor.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

export async function getFieldAnalytics(formId: string, userId: string) {
  await assertFormOwner(formId, userId);

  const fields = await db
    .select()
    .from(formFields)
    .where(eq(formFields.formId, formId))
    .orderBy(formFields.order);

  return Promise.all(
    fields.map(async (field) => {
      if (CHOICE_TYPES.has(field.type)) {
        const distribution = await db
          .select({
            value: sql<string>`${responseAnswers.value}::text`.as("value"),
            count: sql<number>`COUNT(*)::int`.as("count"),
          })
          .from(responseAnswers)
          .where(eq(responseAnswers.fieldId, field.id))
          .groupBy(sql`${responseAnswers.value}::text`)
          .orderBy(desc(sql`COUNT(*)`));

        return {
          fieldId: field.id,
          fieldType: field.type,
          label: field.label,
          kind: "distribution" as const,
          data: distribution,
        };
      }

      const samples = await db
        .select({ value: responseAnswers.value })
        .from(responseAnswers)
        .where(eq(responseAnswers.fieldId, field.id))
        .orderBy(desc(responseAnswers.createdAt))
        .limit(10);

      const [totalRow] = await db
        .select({ total: count() })
        .from(responseAnswers)
        .where(eq(responseAnswers.fieldId, field.id));

      return {
        fieldId: field.id,
        fieldType: field.type,
        label: field.label,
        kind: "samples" as const,
        total: Number(totalRow?.total ?? 0),
        data: samples.map((s) =>
          s.value == null ? "" : JSON.stringify(s.value),
        ),
      };
    }),
  );
}

export async function getPaginatedResponses(
  formId: string,
  userId: string,
  page = 1,
  limit = 20,
) {
  await assertFormOwner(formId, userId);

  const offset = (page - 1) * limit;

  const [totalRow] = await db
    .select({ total: count() })
    .from(formResponses)
    .where(eq(formResponses.formId, formId));

  const total = Number(totalRow?.total ?? 0);

  const rows = await db
    .select()
    .from(formResponses)
    .where(eq(formResponses.formId, formId))
    .orderBy(desc(formResponses.submittedAt))
    .limit(limit)
    .offset(offset);

  const ids = rows.map((r) => r.id);
  const allAnswers =
    ids.length === 0
      ? []
      : await db
          .select()
          .from(responseAnswers)
          .where(inArray(responseAnswers.responseId, ids));

  const answersMap = new Map<string, typeof allAnswers>();
  for (const ans of allAnswers) {
    if (!answersMap.has(ans.responseId)) answersMap.set(ans.responseId, []);
    answersMap.get(ans.responseId)!.push(ans);
  }

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    responses: rows.map((r) => ({
      ...r,
      answers: answersMap.get(r.id) ?? [],
    })),
  };
}

export async function getExportData(formId: string, userId: string) {
  await assertFormOwner(formId, userId);

  const fields = await db
    .select()
    .from(formFields)
    .where(eq(formFields.formId, formId))
    .orderBy(formFields.order);

  const allResponses = await db
    .select()
    .from(formResponses)
    .where(eq(formResponses.formId, formId))
    .orderBy(desc(formResponses.submittedAt));

  const responseIds = allResponses.map((r) => r.id);
  const allAnswers =
    responseIds.length === 0
      ? []
      : await db
          .select()
          .from(responseAnswers)
          .where(inArray(responseAnswers.responseId, responseIds));

  const lookup = new Map<string, Map<string, string>>();
  for (const ans of allAnswers) {
    if (!lookup.has(ans.responseId)) lookup.set(ans.responseId, new Map());
    lookup
      .get(ans.responseId)!
      .set(
        ans.fieldId ?? ans.fieldLabel,
        ans.value == null ? "" : JSON.stringify(ans.value),
      );
  }

  const headers = [
    "Submitted At",
    "Respondent Email",
    ...fields.map((f) => f.label),
  ];

  const rows = allResponses.map((r) => {
    const ansMap = lookup.get(r.id) ?? new Map();
    return [
      r.submittedAt?.toISOString() ?? r.createdAt.toISOString(),
      r.respondentEmail ?? "",
      ...fields.map((f) => ansMap.get(f.id) ?? ""),
    ];
  });

  return { headers, rows };
}

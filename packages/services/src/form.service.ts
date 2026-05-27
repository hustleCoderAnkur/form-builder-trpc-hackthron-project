import { db, forms, formFields } from "@formbit/database";
import { and, desc, eq, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "./utils/generate-slug";

const activeForm = and(isNull(forms.deletedAt));

export async function createForm(input: {
  userId: string;
  title: string;
  description?: string;
}) {
  const slug = generateSlug(input.title);

  const [form] = await db
    .insert(forms)
    .values({
      title: input.title,
      description: input.description,
      slug,
      createdBy: input.userId,
    })
    .returning();

  return form!;
}

export async function getFormsByUser(userId: string) {
  return db
    .select()
    .from(forms)
    .where(and(eq(forms.createdBy, userId), activeForm))
    .orderBy(desc(forms.updatedAt));
}

export async function getFormById(formId: string, userId: string) {
  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, formId), eq(forms.createdBy, userId), activeForm))
    .limit(1);

  if (!form) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
  }
  return form;
}

export async function getPublicFormBySlug(slug: string) {
  const [form] = await db
    .select()
    .from(forms)
    .where(
      and(eq(forms.slug, slug), eq(forms.status, "published"), activeForm),
    )
    .limit(1);

  if (!form) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Form not found or not published",
    });
  }
  return form;
}

export async function getPublicForms(limit = 20, offset = 0) {
  return db
    .select({
      id: forms.id,
      title: forms.title,
      description: forms.description,
      slug: forms.slug,
      publishedAt: forms.publishedAt,
    })
    .from(forms)
    .where(
      and(
        eq(forms.status, "published"),
        eq(forms.visibility, "public"),
        activeForm,
      ),
    )
    .orderBy(desc(forms.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function updateForm(
  formId: string,
  userId: string,
  data: Partial<{
    title: string;
    description: string;
    visibility: "public" | "unlisted";
    themeId: string | null;
  }>,
) {
  await getFormById(formId, userId);

  const [updated] = await db
    .update(forms)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(forms.id, formId))
    .returning();

  return updated!;
}

export async function publishForm(formId: string, userId: string) {
  await getFormById(formId, userId);

  const fields = await db
    .select({ id: formFields.id, type: formFields.type })
    .from(formFields)
    .where(eq(formFields.formId, formId));

  const answerable = fields.filter((f) => f.type !== "section");
  if (answerable.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Add at least one field before publishing",
    });
  }

  const [updated] = await db
    .update(forms)
    .set({
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(forms.id, formId))
    .returning();

  return updated!;
}

export async function unpublishForm(formId: string, userId: string) {
  await getFormById(formId, userId);

  const [updated] = await db
    .update(forms)
    .set({
      status: "draft",
      publishedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(forms.id, formId))
    .returning();

  return updated!;
}

export async function deleteForm(formId: string, userId: string) {
  await getFormById(formId, userId);

  await db
    .update(forms)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(forms.id, formId));

  return { success: true };
}

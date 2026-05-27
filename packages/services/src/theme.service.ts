import { db, themes, forms, type ThemeConfig } from "@formbit/database";
import { and, desc, eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getFormById } from "./form.service";

export async function getThemeGallery() {
  return db
    .select()
    .from(themes)
    .where(or(eq(themes.isSystem, true), eq(themes.isFeatured, true)))
    .orderBy(desc(themes.isFeatured), themes.name);
}

export async function getThemesForUser(userId: string) {
  return db
    .select()
    .from(themes)
    .where(
      or(
        eq(themes.isSystem, true),
        eq(themes.isFeatured, true),
        eq(themes.createdBy, userId),
      ),
    )
    .orderBy(desc(themes.isFeatured), themes.name);
}

export async function getThemeById(themeId: string) {
  const [theme] = await db
    .select()
    .from(themes)
    .where(eq(themes.id, themeId))
    .limit(1);

  if (!theme) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Theme not found" });
  }
  return theme;
}

export async function applyThemeToForm(
  formId: string,
  userId: string,
  themeId: string | null,
) {
  await getFormById(formId, userId);
  if (themeId) await getThemeById(themeId);

  const [updated] = await db
    .update(forms)
    .set({ themeId, updatedAt: new Date() })
    .where(eq(forms.id, formId))
    .returning();

  return updated!;
}

export async function createUserTheme(input: {
  userId: string;
  name: string;
  config: ThemeConfig;
  category?: string;
}) {
  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40);

  const [theme] = await db
    .insert(themes)
    .values({
      name: input.name,
      slug: `${slug}-${Date.now().toString(36)}`,
      createdBy: input.userId,
      config: input.config,
      category: input.category,
      isSystem: false,
    })
    .returning();

  return theme!;
}


import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../client";
import {
  usersTable,
  themes,
  forms,
  formFields,
  formResponses,
  responseAnswers,
} from "../../schema";

const DEMO_EMAIL = "demo@formFactory.dev";
const DEMO_PASSWORD = "demo1234";

const SYSTEM_THEMES = [
  {
    name: "Cyberpunk Neon",
    slug: "cyberpunk-neon",
    category: "games",
    isFeatured: true,
    config: {
      primaryColor: "#00f0ff",
      backgroundColor: "#0a0a12",
      textColor: "#e2e8f0",
      accentColor: "#ff00aa",
      fontFamily: "system-ui",
      borderRadius: "md" as const,
    },
  },
  {
    name: "Anime Sakura",
    slug: "anime-sakura",
    category: "anime",
    isFeatured: true,
    config: {
      primaryColor: "#f472b6",
      backgroundColor: "#fff1f2",
      textColor: "#1f2937",
      accentColor: "#ec4899",
      fontFamily: "system-ui",
      borderRadius: "lg" as const,
    },
  },
  {
    name: "Startup Minimal",
    slug: "startup-minimal",
    category: "startups",
    isFeatured: true,
    config: {
      primaryColor: "#6366f1",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      accentColor: "#4f46e5",
      fontFamily: "system-ui",
      borderRadius: "sm" as const,
    },
  },
];

async function seed() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, DEMO_EMAIL))
    .limit(1);

  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({
        fullName: "Demo Creator",
        email: DEMO_EMAIL,
        password: passwordHash,
        emailVerified: true,
      })
      .returning();
  }

  if (!user) throw new Error("Failed to create demo user");

  for (const t of SYSTEM_THEMES) {
    const [exists] = await db
      .select({ id: themes.id })
      .from(themes)
      .where(eq(themes.slug, t.slug))
      .limit(1);
    if (!exists) {
      await db.insert(themes).values({ ...t, isSystem: true });
    }
  }

  const [theme] = await db
    .select()
    .from(themes)
    .where(eq(themes.slug, "cyberpunk-neon"))
    .limit(1);

  let [form] = await db
    .select()
    .from(forms)
    .where(eq(forms.slug, "cyberpunk-fan-survey-demo"))
    .limit(1);

  if (!form) {
    [form] = await db
      .insert(forms)
      .values({
        title: "Cyberpunk 2077 Fan Survey",
        description: "Tell us about your experience in Night City",
        slug: "cyberpunk-fan-survey-demo",
        createdBy: user.id,
        themeId: theme?.id ?? null,
        status: "published",
        visibility: "public",
        publishedAt: new Date(),
      })
      .returning();
  }

  if (!form) throw new Error("Failed to create demo form");

  const existingFields = await db
    .select({ id: formFields.id })
    .from(formFields)
    .where(eq(formFields.formId, form.id))
    .limit(1);

  if (existingFields.length === 0) {
    const [f1] = await db
      .insert(formFields)
      .values({
        formId: form.id,
        type: "short_text",
        label: "Favorite character",
        order: 0,
        isRequired: true,
        validationConfig: { placeholder: "e.g. V, Johnny" },
      })
      .returning();

    const [f2] = await db
      .insert(formFields)
      .values({
        formId: form.id,
        type: "rating",
        label: "Game rating",
        order: 1,
        isRequired: true,
        validationConfig: { min: 1, max: 5 },
      })
      .returning();

    await db.insert(formFields).values({
      formId: form.id,
      type: "select",
      label: "Play style",
      order: 2,
      validationConfig: {
        options: [
          { label: "Stealth", value: "stealth" },
          { label: "Combat", value: "combat" },
          { label: "Netrunner", value: "netrunner" },
        ],
      },
    });

    const [response] = await db
      .insert(formResponses)
      .values({
        formId: form.id,
        status: "submitted",
        respondentEmail: "fan@nightcity.io",
        submittedAt: new Date(),
      })
      .returning();

    if (response && f1 && f2) {
      await db.insert(responseAnswers).values([
        {
          responseId: response.id,
          fieldId: f1.id,
          fieldLabel: f1.label,
          fieldType: f1.type,
          value: "Johnny Silverhand",
        },
        {
          responseId: response.id,
          fieldId: f2.id,
          fieldLabel: f2.label,
          fieldType: f2.type,
          value: 5,
        },
      ]);
    }
  }

  const [unlisted] = await db
    .select()
    .from(forms)
    .where(eq(forms.slug, "unlisted-bug-report-demo"))
    .limit(1);

  if (!unlisted) {
    await db.insert(forms).values({
      title: "Unlisted Bug Report",
      slug: "unlisted-bug-report-demo",
      createdBy: user.id,
      status: "published",
      visibility: "unlisted",
      publishedAt: new Date(),
    });
  }

  console.log("\n--- Demo credentials ---");
  console.log(`Email:    ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log(`Public form: /f/cyberpunk-fan-survey-demo`);
  console.log("Seed complete.\n");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

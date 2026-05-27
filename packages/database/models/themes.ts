import { pgTable, text, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core"
import { usersTable } from "./user"

export interface ThemeConfig {
    primaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
    fontFamily: string
    borderRadius: "none" | "sm" | "md" | "lg" | "full"
    backgroundImage?: string
    logoUrl?: string
}

export const themes = pgTable("themes", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    createdBy: uuid("created_by").references(() => usersTable.id, { onDelete: "set null" }),
    config: jsonb("config").notNull().default({}).$type<ThemeConfig>(),
    isSystem: boolean("is_system").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    category: text("category"),
    previewImageUrl: text("preview_image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Theme = typeof themes.$inferSelect
export type NewTheme = typeof themes.$inferInsert
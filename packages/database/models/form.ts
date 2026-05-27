import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    pgEnum,
    uuid
} from "drizzle-orm/pg-core"
import { usersTable } from "./user"
import { themes } from "./themes"

export const formStatusEnum = pgEnum("form_status", [
    "draft",
    "published",
    "archived",
    "closed",
])

export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"])

export const forms = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    createdBy: uuid("created_by").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    themeId: uuid("theme_id").references(() => themes.id, { onDelete: "set null" }),
    status: formStatusEnum("status").notNull().default("draft"),
    visibility: formVisibilityEnum("visibility").notNull().default("unlisted"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    responseLimitCount: integer("response_limit_count"),
    passwordHash: text("password_hash"),
    allowMultipleResponses: boolean("allow_multiple_responses").notNull().default(false),
    showResponseCount: boolean("show_response_count").notNull().default(false),
    internalNotes: text("internal_notes"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Form = typeof forms.$inferSelect
export type NewForm = typeof forms.$inferInsert
export type FormStatus = (typeof formStatusEnum.enumValues)[number]
export type FormVisibility = (typeof formVisibilityEnum.enumValues)[number]
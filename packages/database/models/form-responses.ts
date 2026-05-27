import {
    pgTable,
    text,
    timestamp,
    integer,
    pgEnum,
    boolean,
    uuid
} from "drizzle-orm/pg-core"
import { forms } from "./form"

export const responseStatusEnum = pgEnum("response_status", [
    "in_progress",
    "submitted",
    "flagged"
])

export const formResponses = pgTable("form_responses", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
    status: responseStatusEnum("status").notNull().default("submitted"),
    respondentEmail: text("respondent_email"),
    ipHash: text("ip_hash"),
    completionTimeSeconds: integer("completion_time_seconds"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    isFlagged: boolean("is_flagged").notNull().default(false),
    flaggedReason: text("flagged_reason"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type FormResponse = typeof formResponses.$inferSelect
export type NewFormResponse = typeof formResponses.$inferInsert
export type ResponseStatus = (typeof responseStatusEnum.enumValues)[number]
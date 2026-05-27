import { uuid, pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { formResponses } from "./form-responses"
import { formFields } from "./form-fields"

export type AnswerValue = string | number | boolean | string[] | null | Array<{ url: string; name: string; size: number }>

export const responseAnswers = pgTable("response_answers", {
    id: uuid("id").primaryKey().defaultRandom(),
    responseId: uuid("response_id").notNull().references(() => formResponses.id, { onDelete: "cascade" }),
    fieldId: uuid("field_id").references(() => formFields.id, { onDelete: "set null" }),
    fieldLabel: text("field_label").notNull(),
    fieldType: text("field_type").notNull(),
    value: jsonb("value").$type<AnswerValue>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type ResponseAnswer = typeof responseAnswers.$inferSelect
export type NewResponseAnswer = typeof responseAnswers.$inferInsert
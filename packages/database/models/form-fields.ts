import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    jsonb,
    pgEnum,
    uuid
} from "drizzle-orm/pg-core"
import { forms } from "./form"

export const fieldTypeEnum = pgEnum("field_type", [
    "short_text", "long_text", "email", "number", "phone", "url", "date", "time", "select",
    "multi_select", "radio", "checkbox", "rating", "scale", "file_upload", "section",
])

export interface BaseFieldValidation {
    required?: boolean
    errorMessage?: string
}

export interface TextFieldValidation extends BaseFieldValidation {
    minLength?: number
    maxLength?: number
    pattern?: string
    placeholder?: string
}

export interface NumberFieldValidation extends BaseFieldValidation {
    min?: number
    max?: number
    step?: number
    placeholder?: string
}

export interface SelectFieldValidation extends BaseFieldValidation {
    options: Array<{
        label: string
        value: string
    }>
    allowOther?: boolean
}

export interface RatingFieldValidation extends BaseFieldValidation {
    min?: number
    max?: number
    labels?: { start?: string; end?: string }
}

export interface ScaleFieldValidation extends BaseFieldValidation {
    min?: number
    max?: number
    labels?: { start?: string; end?: string }
}

export interface FileFieldValidation extends BaseFieldValidation {
    maxSizeMb?: number
    allowedTypes?: string[]
    maxFiles?: number
}

export type FieldValidation = TextFieldValidation | NumberFieldValidation | SelectFieldValidation
    | RatingFieldValidation | ScaleFieldValidation | FileFieldValidation | BaseFieldValidation

export const formFields = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
    type: fieldTypeEnum("type").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    order: integer("order").notNull().default(0),
    isRequired: boolean("is_required").notNull().default(false),
    validationConfig: jsonb("validation_config").notNull().default({}).$type<FieldValidation>(),
    conditionalLogic: jsonb("conditional_logic").$type<{
        dependsOn: string
        operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
        value: string
    } | null>(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type FormField = typeof formFields.$inferSelect
export type NewFormField = typeof formFields.$inferInsert
export type FieldType = (typeof fieldTypeEnum.enumValues)[number]
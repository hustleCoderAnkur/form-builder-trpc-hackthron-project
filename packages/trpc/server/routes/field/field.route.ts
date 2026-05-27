import { router, protectedProcedure } from "../../trpc.js";
import {
  getFieldsByForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
} from "@repo/services/field.service";
import { getFormById } from "@repo/services/form.service";
import {
  addFieldSchema,
  updateFieldSchema,
  deleteFieldSchema,
  reorderFieldsSchema,
  listFieldsSchema,
} from "./schemas.js";

export const fieldRouter = router({
  list: protectedProcedure
    .input(listFieldsSchema)
    .query(async ({ input, ctx }) => {
      await getFormById(input.formId, ctx.user.id);
      return getFieldsByForm(input.formId);
    }),

  add: protectedProcedure
    .input(addFieldSchema)
    .mutation(({ input, ctx }) => {
      const { formId, validationConfig, ...rest } = input;
      return addField(formId, ctx.user.id, {
        ...rest,
        validationConfig: validationConfig ?? {},
      });
    }),

  update: protectedProcedure
    .input(updateFieldSchema)
    .mutation(({ input, ctx }) => {
      const { fieldId, formId, ...data } = input;
      return updateField(fieldId, ctx.user.id, formId, data);
    }),

  delete: protectedProcedure
    .input(deleteFieldSchema)
    .mutation(({ input, ctx }) =>
      deleteField(input.fieldId, ctx.user.id, input.formId),
    ),

  reorder: protectedProcedure
    .input(reorderFieldsSchema)
    .mutation(({ input, ctx }) =>
      reorderFields(input.formId, ctx.user.id, input.orderedIds),
    ),
});

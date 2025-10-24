import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { customForms, formFields, formResponses } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const customFormsRouter = router({
  // List forms for an event
  list: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(customForms)
        .where(eq(customForms.eventId, input.eventId))
        .orderBy(customForms.createdAt);
    }),

  // Get form with fields
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const form = await db
        .select()
        .from(customForms)
        .where(eq(customForms.id, input.id))
        .limit(1);

      if (!form[0]) throw new Error("Form not found");

      const fields = await db
        .select()
        .from(formFields)
        .where(eq(formFields.formId, input.id))
        .orderBy(formFields.orderIndex);

      return {
        ...form[0],
        fields,
      };
    }),

  // Create form
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        fields: z.array(
          z.object({
            label: z.string(),
            fieldType: z.enum(["text", "email", "number", "textarea", "select", "checkbox", "radio", "date"]),
            options: z.string().optional(),
            isRequired: z.boolean().default(false),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const formId = `form_${Date.now()}`;

      // Create form
      await db.insert(customForms).values({
        id: formId,
        eventId: input.eventId,
        title: input.title,
        description: input.description || null,
        isActive: true,
      });

      // Create fields
      for (let i = 0; i < input.fields.length; i++) {
        const field = input.fields[i];
        await db.insert(formFields).values({
          id: `field_${Date.now()}_${i}`,
          formId,
          label: field.label,
          fieldType: field.fieldType,
          options: field.options || null,
          isRequired: field.isRequired,
          orderIndex: i,
        });
      }

      return { id: formId };
    }),

  // Submit form response
  submit: publicProcedure
    .input(
      z.object({
        formId: z.string(),
        userName: z.string().optional(),
        userEmail: z.string().optional(),
        responseData: z.string(), // JSON string
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `resp_${Date.now()}`;
      await db.insert(formResponses).values({
        id,
        formId: input.formId,
        userId: ctx.user?.id || null,
        userName: input.userName || null,
        userEmail: input.userEmail || null,
        responseData: input.responseData,
      });

      return { id };
    }),

  // Get responses for a form
  getResponses: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(formResponses)
        .where(eq(formResponses.formId, input.formId))
        .orderBy(formResponses.submittedAt);
    }),

  // Delete form
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete responses
      await db.delete(formResponses).where(eq(formResponses.formId, input.id));
      
      // Delete fields
      await db.delete(formFields).where(eq(formFields.formId, input.id));
      
      // Delete form
      await db.delete(customForms).where(eq(customForms.id, input.id));

      return { success: true };
    }),
});


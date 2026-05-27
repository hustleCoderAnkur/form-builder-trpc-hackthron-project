import { db, usersTable } from "@formbit/database";
import { eq } from "drizzle-orm";
import { logger } from "@repo/logger";

export async function sendResponseNotification(input: {
  creatorId: string;
  formTitle: string;
  responseId: string;
  respondentEmail?: string;
}) {
  if (!process.env.SMTP_HOST) return;

  const [creator] = await db
    .select({ email: usersTable.email, name: usersTable.fullName })
    .from(usersTable)
    .where(eq(usersTable.id, input.creatorId))
    .limit(1);

  if (!creator?.email) return;

  logger.info("Response notification (configure SMTP to send email)", {
    to: creator.email,
    formTitle: input.formTitle,
    responseId: input.responseId,
    respondentEmail: input.respondentEmail,
  });
}

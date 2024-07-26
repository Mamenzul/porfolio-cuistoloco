"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { notifications } from "@/server/db/schema";
import { env } from "@/env.js";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { getErrorMessage } from "@/lib/handle-error";
import { resend } from "@/lib/resend";
import type { UpdateNotificationSchema } from "@/lib/validations/notification";
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email";

export async function joinNewsletter(input: { email: string }) {
  const token = crypto.randomUUID();
  try {
    const addNotification = await db
      .insert(notifications)
      .values({
        email: input.email,
        token,
      })
      .returning();
    return addNotification[0];
  } catch (err) {
    return null;
  }
}
export async function updateNotification(input: UpdateNotificationSchema) {
  try {
    const notification = await db
      .select({
        email: notifications.email,
        newsletter: notifications.newsletter,
        communication: notifications.communication,
        marketing: notifications.marketing,
      })
      .from(notifications)
      .where(eq(notifications.token, input.token))
      .then((res) => res[0]);

    if (!notification) {
      throw new Error("Email not found.");
    }

    const user = await currentUser();

    if (input.newsletter && !notification.newsletter) {
      await resend.emails.send({
        from: env.EMAIL_FROM_ADDRESS,
        to: notification.email,
        subject: "Welcome to CuistoLoco",
        react: NewsletterWelcomeEmail({
          firstName: user?.firstName ?? undefined,
          fromEmail: env.EMAIL_FROM_ADDRESS,
          token: input.token,
        }),
      });
    }

    await db
      .update(notifications)
      .set({
        ...input,
        userId: user?.id,
      })
      .where(eq(notifications.token, input.token));

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

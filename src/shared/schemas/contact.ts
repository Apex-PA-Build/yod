import { z } from "zod";
import { emailSchema } from "./checkout";

export const newsletterSchema = z.object({ email: emailSchema });
export type NewsletterValues = z.infer<typeof newsletterSchema>;

export const CONTACT_TOPICS = ["order", "sizing", "returns", "other"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: emailSchema,
  topic: z.enum(CONTACT_TOPICS),
  orderNumber: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});
export type ContactValues = z.infer<typeof contactSchema>;

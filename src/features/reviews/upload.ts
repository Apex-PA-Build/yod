import type { Id } from "@convex/_generated/dataModel";
import { z } from "zod";

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const reviewPhotoSchema = z
  .instanceof(File)
  .refine((f) => (PHOTO_TYPES as readonly string[]).includes(f.type), "Photos must be JPG, PNG or WebP.")
  .refine((f) => f.size <= MAX_PHOTO_BYTES, "Each photo must be under 5 MB.");

/** Uploads one file to Convex storage through a short-lived upload URL. */
export async function uploadToStorage(uploadUrl: string, file: File): Promise<Id<"_storage">> {
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) throw new Error(`Upload failed with ${response.status}`);
  const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };
  return storageId;
}

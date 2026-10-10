"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useId, useMemo } from "react";
import { MAX_REVIEW_PHOTOS } from "@/shared/catalog";
import { PHOTO_TYPES, reviewPhotoSchema } from "../upload";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  onError: (message: string | null) => void;
  error: string | null;
};

export function PhotoPicker({ files, onChange, onError, error }: Props) {
  const id = useId();
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  function add(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list);
    for (const file of picked) {
      const result = reviewPhotoSchema.safeParse(file);
      if (!result.success) {
        onError(result.error.issues[0]?.message ?? "That photo can't be used.");
        return;
      }
    }
    const next = [...files, ...picked];
    if (next.length > MAX_REVIEW_PHOTOS) {
      onError(`You can add up to ${MAX_REVIEW_PHOTOS} photos.`);
      return;
    }
    onError(null);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold tracking-[0.06em] uppercase">Photos (optional)</span>
      <div className="flex flex-wrap gap-2">
        {previews.map((url, i) => (
          <div key={url} className="relative size-20">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            <img src={url} alt={`Selected photo ${i + 1}`} className="size-full object-cover" />
            <button
              type="button"
              aria-label={`Remove photo ${i + 1}`}
              onClick={() => onChange(files.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 grid size-6 cursor-pointer place-items-center bg-inverse text-on-inverse"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {files.length < MAX_REVIEW_PHOTOS ? (
          <label
            htmlFor={id}
            className="grid size-20 cursor-pointer place-items-center border border-dashed border-line-strong text-muted hover:border-fg hover:text-fg"
          >
            <ImagePlus className="size-5" aria-hidden />
            <span className="sr-only">Add photos</span>
          </label>
        ) : null}
      </div>
      <input
        id={id}
        type="file"
        accept={PHOTO_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? (
        <p role="alert" className="m-0 text-[13px] font-semibold text-accent">
          {error}
        </p>
      ) : (
        <p className="m-0 text-[13px] text-subtle">
          Up to {MAX_REVIEW_PHOTOS} photos, JPG, PNG or WebP, 5 MB each.
        </p>
      )}
    </div>
  );
}

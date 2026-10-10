"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Star } from "lucide-react";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { errorProps, Field, Input, NativeSelect, Textarea } from "@/components/ui/field";
import { ToggleChip } from "@/components/ui/toggle-chip";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { FIT_FEEDBACK, LABELS, type Size } from "@/shared/catalog";
import { reviewFormSchema, type ReviewFormValues } from "@/shared/schemas/review";
import { uploadToStorage } from "../upload";
import { PhotoPicker } from "./photo-picker";

type Props = {
  productId: Id<"products">;
  colours: { key: string; name: string }[];
  sizes: Size[];
  onDone: () => void;
};

export function ReviewForm({ productId, colours, sizes, onDone }: Props) {
  const id = useId();
  const generateUploadUrl = useMutation(api.reviews.generateUploadUrl);
  const createReview = useMutation(api.reviews.create);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: 0, title: "", body: "", colourKey: colours[0]?.key ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const photoIds = await Promise.all(
        photos.map(async (file) => uploadToStorage(await generateUploadUrl(), file)),
      );
      await createReview({ productId, ...values, photoIds });
      onDone();
    } catch (error) {
      setFormError(errorMessage(error, "We couldn't post your review. Please try again."));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="mb-2 text-[13px] font-semibold tracking-[0.06em] uppercase">
              Your rating
            </legend>
            <div role="radiogroup" aria-label="Rating" className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={field.value === n}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => field.onChange(n)}
                  className="grid size-11 cursor-pointer place-items-center"
                >
                  <Star
                    aria-hidden
                    strokeWidth={0}
                    className={cn("size-7", n <= field.value ? "fill-accent" : "fill-line-strong")}
                  />
                </button>
              ))}
            </div>
            {errors.rating ? (
              <p role="alert" className="m-0 text-[13px] font-semibold text-accent">
                {errors.rating.message}
              </p>
            ) : null}
          </fieldset>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Size you bought" htmlFor={`${id}-size`} error={errors.size?.message}>
          <NativeSelect
            defaultValue=""
            {...errorProps(`${id}-size`, errors.size?.message)}
            {...register("size")}
          >
            <option value="" disabled>
              Choose
            </option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Colour" htmlFor={`${id}-colour`} error={errors.colourKey?.message}>
          <NativeSelect {...errorProps(`${id}-colour`, errors.colourKey?.message)} {...register("colourKey")}>
            {colours.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <Controller
        control={control}
        name="fit"
        render={({ field }) => (
          <div role="group" aria-label="How did it fit?" className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold tracking-[0.06em] uppercase">
              How did it fit? (optional)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {FIT_FEEDBACK.map((f) => (
                <ToggleChip
                  key={f}
                  pressed={field.value === f}
                  onClick={() => field.onChange(field.value === f ? undefined : f)}
                  className="h-11 px-2 text-[13px]"
                >
                  {LABELS.fitFeedback[f]}
                </ToggleChip>
              ))}
            </div>
          </div>
        )}
      />

      <Field label="Title" htmlFor={`${id}-title`} error={errors.title?.message}>
        <Input
          placeholder="Sum it up in a few words"
          maxLength={80}
          {...errorProps(`${id}-title`, errors.title?.message)}
          {...register("title")}
        />
      </Field>

      <Field label="Review" htmlFor={`${id}-body`} error={errors.body?.message}>
        <Textarea
          placeholder="How did the fit, fabric and drape feel? How did you style it?"
          maxLength={2000}
          rows={5}
          {...errorProps(`${id}-body`, errors.body?.message)}
          {...register("body")}
        />
      </Field>

      <PhotoPicker files={photos} onChange={setPhotos} onError={setPhotoError} error={photoError} />

      {formError ? (
        <p role="alert" className="m-0 text-sm font-semibold text-accent">
          {formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" caps disabled={isSubmitting}>
        {isSubmitting ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}

"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

type SheetContentProps = ComponentProps<typeof Dialog.Content> & {
  title: ReactNode;
  side?: "right" | "left";
};

/** A full-height side panel (cart drawer, mobile menu). */
export function SheetContent({ title, side = "right", className, children, ...props }: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 z-50 flex w-full max-w-md flex-col border-line bg-bg text-fg shadow-2xl outline-none",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <Dialog.Title className="m-0 text-[13px] font-bold tracking-[0.14em] uppercase">
            {title}
          </Dialog.Title>
          <Dialog.Close
            className="grid size-11 cursor-pointer place-items-center hover:text-accent"
            aria-label="Close"
          >
            <X className="size-5" />
          </Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">{title}</Dialog.Description>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-line", className)} {...props} />;
}

type TriggerProps = ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /** Small index shown before the question, e.g. "01". */
  index?: string;
  /** "boxed" shows the square plus tile from the home FAQ; "plain" a gold +/−. */
  icon?: "boxed" | "plain";
  children: ReactNode;
};

export function AccordionTrigger({ className, index, icon = "boxed", children, ...props }: TriggerProps) {
  return (
    <AccordionPrimitive.Header className="m-0">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-6 bg-transparent py-6 text-left text-fg",
          className,
        )}
        {...props}
      >
        <span className="flex min-w-0 items-baseline gap-5">
          {index ? (
            <span className="shrink-0 text-sm font-medium text-subtle group-data-[state=open]:text-accent">
              {index}
            </span>
          ) : null}
          <span>{children}</span>
        </span>
        {icon === "boxed" ? (
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center bg-surface-2 text-fg transition-colors group-data-[state=open]:bg-inverse group-data-[state=open]:text-on-inverse"
          >
            <Plus
              className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-45"
              strokeWidth={2.2}
            />
          </span>
        ) : (
          <span aria-hidden className="text-[22px] font-normal text-accent">
            <span className="group-data-[state=open]:hidden">+</span>
            <span className="hidden group-data-[state=open]:inline">−</span>
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-none" {...props}>
      <div className={cn("pb-7 text-[15px] leading-[1.7] whitespace-pre-line text-muted", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

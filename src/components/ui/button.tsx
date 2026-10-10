import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-inverse text-on-inverse hover:bg-accent hover:text-on-accent",
        accent: "bg-accent text-on-accent hover:bg-accent-hover",
        outline: "border-[1.5px] border-fg bg-transparent text-fg hover:bg-inverse hover:text-on-inverse",
        subtle: "border-[1.5px] border-line-strong bg-transparent text-fg hover:border-fg",
        ghost: "bg-transparent text-fg hover:text-accent",
        link: "h-auto bg-transparent p-0 text-fg underline-offset-4 hover:text-accent hover:underline",
      },
      size: {
        sm: "h-11 px-4 text-[13px]",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-7 text-[15px]",
        xl: "h-16 px-10 text-base",
        icon: "size-11",
      },
      caps: {
        true: "tracking-[0.08em] uppercase",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", caps: false },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, caps, asChild, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, caps }), className)}
      {...props}
    />
  );
}

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center rounded-[3px] border border-transparent px-2 py-0.5 text-xs font-normal",
  {
    variants: {
      variant: {
        accent: "bg-[var(--tag-bg)] text-[var(--tag-text)]",
        skill: "bg-[var(--surface-chip)] text-notion-soft",
      },
    },
    defaultVariants: { variant: "accent" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function ContentSection({
  title,
  description,
  children,
  className,
  asChild = false,
  ...props
}: ContentSectionProps) {
  const ChildrenShell = asChild ? Slot : "div";

  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
          <h2 className="text-2xl font-bold leading-[1.1] md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-[46.875rem] text-balance text-sm leading-normal text-muted-foreground sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-8">
        <ChildrenShell
          className={cn(
            !asChild &&
              "xs:grid-cols-2 grid gap-4 md:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {children}
        </ChildrenShell>
        <Button
          variant="ghost"
          className="mx-auto flex w-fit sm:hidden"
          asChild
        ></Button>
      </div>
    </section>
  );
}

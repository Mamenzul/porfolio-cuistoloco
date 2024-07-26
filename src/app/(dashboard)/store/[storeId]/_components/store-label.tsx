"use client";

import * as React from "react";

import { type getStoreByUserId } from "@/lib/queries/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { type PopoverTrigger } from "@/components/ui/popover";

interface StoreSwitcherProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  storePromise: ReturnType<typeof getStoreByUserId>;
}

export function StoreLabel({
  storePromise,
  className,
  ...props
}: StoreSwitcherProps) {
  const store = React.use(storePromise);

  const selectedStore = store[0];
  if (!selectedStore) {
    return null;
  }

  return (
    <>
      <Button
        disabled
        variant="outline"
        aria-label="My store"
        className={cn("w-full justify-between disabled:opacity-100", className)}
        {...props}
      >
        {selectedStore?.name ?? "Select a store"}
      </Button>
    </>
  );
}

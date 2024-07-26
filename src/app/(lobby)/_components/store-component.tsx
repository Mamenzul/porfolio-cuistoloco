"use client";

import * as React from "react";

import { type PopoverTrigger } from "@/components/ui/popover";
import { type getFeaturedStores } from "@/lib/queries/store";
import { StoreCard } from "@/components/store-card";
import { ContentSection } from "@/components/content-section";
interface StoreCardProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  storesPromise: ReturnType<typeof getFeaturedStores>;
}

export function StoreComponent({ storesPromise }: StoreCardProps) {
  const stores = React.use(storesPromise);
  return (
    <ContentSection
      title="Ils utilisent CuistoLoco"
      description="Découvrez les traiteurs qui utilisent notre plateforme"
      className="flex w-full flex-col items-center justify-center space-y-4 py-12 text-center md:py-24 lg:py-32"
    >
      {stores?.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          href={`/${store.name.toLowerCase()}`}
        />
      ))}
    </ContentSection>
  );
}

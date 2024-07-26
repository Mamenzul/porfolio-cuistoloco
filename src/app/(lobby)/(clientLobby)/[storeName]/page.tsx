import { Shell } from "@/components/shell";
import * as React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { env } from "@/env";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

import { Separator } from "@/components/ui/separator";
import { stores } from "@/server/db/schema";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductsFromStore } from "@/lib/queries/product";
import { ProductComponent } from "./_components/product-component";
import { lower } from "@/server/db/schema/utils";
import { getFeaturedStores } from "@/lib/queries/store";
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),

  title: "Page d'accueil",
  description:
    "Ceci est la page d'accueil avec le hero du site web du restaurant",
};

export default async function IndexPage({
  params,
}: {
  params: { storeName: string };
}) {
  const store = await db.query.stores.findFirst({
    where: eq(lower(stores.name), params.storeName),
  });
  if (!store) {
    notFound();
  }
  const productsPromise = getProductsFromStore(store.id);
  return (
    <Shell className="">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div className="flex w-full flex-col justify-center gap-5">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl">
              <span>Bienvenue chez </span>
              <span className="font-bold">{store.name}</span>
            </h1>
          </div>
        </div>
        <div className="hidden h-auto w-full justify-center lg:flex">
          <Image
            src="/images/placeholder.svg"
            alt="Illustration d'un plat de pâtes fraiches faites maison"
            height={200}
            width={400}
            priority={true}
            sizes="(max-width: 768px) 0vw, (max-width: 1200px) 33vw, 25vw"
            blurDataURL="data:image/webp;base64,UklGRiIDAABXRUJQVlA4WAoAAAAgAAAAiAAAiAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggNAEAABANAJ0BKokAiQA+7WyxU6m/tKKlkSrD8B2JZ27gNqirYtyHp38AIE1VINwYG2NYkaJ5Dx2DGRbBd0IK6njny+vhBBW1QDETuhAzb5SwLggLgp5GAYZRY5WSz/VQ6I3UUjxlmds+0jiQtqmHDyCqJ/FAAP7wZQPvri5siG3Ajp07PrGxA/+Wc/XWGMYvzdFDV3TIIcJunOW1vdMhNNbyRYzzzh1uYvpCpwKq3KBIN+1OrQDRXhahABZMK5B1YPEpT+A9ofgG3igxgb0X069y9+Y7uEX8WO2/MHGEuYV89gEOMqkFSBI+wy4sejWLCivFST03Qw3p/I4c+kVj0ytFZm8EphibJx9kTYDfXsrQGubDrjymj5/kwe0/2gIXXNfLyJmJy0TOKCqcaMT6863H7yvYPAAA
"
            placeholder="blur"
            className="rounded-3xl object-cover duration-100"
          />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="flex w-full flex-col">
        <React.Suspense fallback={<Skeleton className="size-full" />}>
          <ProductComponent productsPromise={productsPromise} />
        </React.Suspense>
      </div>
    </Shell>
  );
}

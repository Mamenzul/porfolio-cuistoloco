import * as React from "react";
import Link from "next/link";
import type { User } from "@clerk/nextjs/server";
import { DashboardIcon } from "@radix-ui/react-icons";

import { getStoreByUserIdSlug } from "@/lib/queries/store";

import { Skeleton } from "@/components/ui/skeleton";

interface ActionLinkProps {
  user: User | null;
}

export async function ActionLink({ user }: ActionLinkProps) {
  if (!user) {
    return (
      <>
        <Link
          href="/signin"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Se connecter
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          S&apos;inscrire
        </Link>
      </>
    );
  }

  const storePromise = getStoreByUserIdSlug({ userId: user.id });

  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col space-y-1.5 p-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full rounded-sm" />
          ))}
        </div>
      }
    >
      <ActionLinkGroup storePromise={storePromise} />
    </React.Suspense>
  );
}

interface ActionLinkGroupProps {
  storePromise: ReturnType<typeof getStoreByUserIdSlug>;
}

async function ActionLinkGroup({ storePromise }: ActionLinkGroupProps) {
  const store = await storePromise;

  return (
    <Link
      href={store ? `/store/${store.id}` : "/onboarding"}
      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    >
      <DashboardIcon className="mr-2 size-4" aria-hidden="true" />
      Tableau de bord
    </Link>
  );
}

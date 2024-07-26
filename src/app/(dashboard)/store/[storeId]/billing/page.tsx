import * as React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { env } from "@/env.js";

import { getPlan, getPlans } from "@/lib/actions/stripe";
import { getCachedUser, getUserUsageMetrics } from "@/lib/queries/user";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";

import { Billing } from "./_components/billing";
import { BillingSkeleton } from "./_components/billing-skeleton";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Facturation",
  description: "Gérez votre facturation et votre abonnement",
};

export default async function BillingPage() {
  const user = await getCachedUser();

  if (!user) {
    redirect("/signin");
  }

  const planPromise = getPlan({ userId: user.id });
  const plansPromise = getPlans();
  const usageMetricsPromise = getUserUsageMetrics({ userId: user.id });

  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Facturation</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Gérez votre facturation et votre abonnement
        </PageHeaderDescription>
      </PageHeader>
      <React.Suspense fallback={<BillingSkeleton />}>
        <Billing
          planPromise={planPromise}
          plansPromise={plansPromise}
          usageMetricsPromise={usageMetricsPromise}
        />
      </React.Suspense>
    </Shell>
  );
}

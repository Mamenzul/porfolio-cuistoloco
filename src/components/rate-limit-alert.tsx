import Link from "next/link";

import { type getUserPlanMetrics } from "@/lib/queries/user";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { ManagePlanForm } from "./manage-plan-form";

interface RateLimitAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  planMetrics: Awaited<ReturnType<typeof getUserPlanMetrics>>;
}

export function RateLimitAlert({
  planMetrics,
  className,
  ...props
}: RateLimitAlertProps) {
  const { productLimit, productLimitExceeded, subscriptionPlan } = planMetrics;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {productLimitExceeded && (
        <div className="text-sm text-muted-foreground">
          Vous avez la limite de
          <span className="font-bold">{productLimit}</span> produits pour le
          plan
          <span className="font-bold">{subscriptionPlan?.title}</span>.
        </div>
      )}
      {subscriptionPlan ? (
        subscriptionPlan.title === "Pro" ? (
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ className: "w-full" })}
          >
            Contactez nous
          </Link>
        ) : (
          <ManagePlanForm
            stripePriceId={subscriptionPlan.stripePriceId}
            stripeCustomerId={subscriptionPlan.stripeCustomerId}
            stripeSubscriptionId={subscriptionPlan.stripeSubscriptionId}
            isSubscribed={subscriptionPlan.isSubscribed}
          />
        )
      ) : null}
    </div>
  );
}

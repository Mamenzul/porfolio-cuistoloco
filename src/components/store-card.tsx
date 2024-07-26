import Link from "next/link";

import { type getStoreByUserId } from "@/lib/queries/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

type Store = Awaited<ReturnType<typeof getStoreByUserId>>[number];

interface StoreCardProps {
  store: Omit<Store, "orderCount" | "customerCount"> &
    Partial<Pick<Store, "orderCount" | "customerCount">>;
  href: string;
}

export function StoreCard({ store, href }: StoreCardProps) {
  const isUserStore = href.includes("dashboard");

  return (
    <Link href={href}>
      <Card className="relative h-full rounded-lg transition-colors hover:bg-muted/25">
        {isUserStore ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={cn(
                  "absolute right-4 top-4 rounded-sm px-2 py-0.5 font-semibold",
                  store.stripeAccountId
                    ? "border-green-600/20 bg-green-100 text-green-700"
                    : "border-red-600/10 bg-red-100 text-red-700",
                )}
              >
                {store.stripeAccountId ? "Active" : "Inactive"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              className="w-52 border border-input bg-background text-foreground shadow-sm"
            >
              Connectez votre compte Stripe pour accepter les paiements en ligne
            </TooltipContent>
          </Tooltip>
        ) : (
          <Badge
            className={cn(
              "pointer-events-none absolute right-4 top-4 rounded-sm px-2 py-0.5 font-semibold",
              store.stripeAccountId
                ? "border-green-600/20 bg-green-100 text-green-700"
                : "border-red-600/10 bg-red-100 text-red-700",
            )}
          >
            {store.stripeAccountId ? "Actif" : "Inactif"}
          </Badge>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-1">{store.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {store.description?.length
              ? store.description
              : `Explorez les produits de ${store.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 pt-4 text-[0.8rem] text-muted-foreground">
          <div className="flex items-center">
            <Icons.product className="mr-1.5 size-3.5" aria-hidden="true" />
            {store.productCount} produits
          </div>
          {isUserStore ? (
            <>
              <div className="flex items-center">
                <Icons.cart className="mr-1.5 size-3.5" aria-hidden="true" />
                {store.orderCount} commandes
              </div>
              <div className="flex items-center">
                <Icons.users className="mr-1.5 size-3.5" aria-hidden="true" />
                {store.customerCount} clients
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

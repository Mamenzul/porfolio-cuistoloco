import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartLineItems } from "@/components/checkout/cart-line-items";
import { type CartLineItemSchema } from "@/lib/validations/cart";

interface CheckoutCardProps {
  cartLineItems: CartLineItemSchema[];
}

export async function CheckoutCard({ cartLineItems }: CheckoutCardProps) {
  return (
    <Card
      key={cartLineItems[0]?.storeId}
      as="section"
      id={`checkout-store-${cartLineItems[0]?.storeId}`}
      aria-labelledby={`checkout-store-${cartLineItems[0]?.storeId}-heading`}
      className={cn(
        cartLineItems[0]?.storeStripeAccountId
          ? "border-green-500"
          : "border-destructive",
      )}
    >
      <CardHeader className="flex flex-row items-center space-x-4 py-4">
        <CardTitle className="line-clamp-1 flex-1">
          {cartLineItems[0]?.storeName}
        </CardTitle>
        <Link
          aria-label="Checkout"
          href={`/checkout/${cartLineItems[0]?.storeId}`}
          className={cn(
            buttonVariants({
              size: "sm",
            }),
          )}
        >
          Passer en caisse
        </Link>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="pb-6 pl-6 pr-0">
        <CartLineItems items={cartLineItems} className="max-h-[280px]" />
      </CardContent>
      <Separator className="mb-4" />
      <CardFooter className="space-x-4">
        <span className="flex-1">
          Total ({cartLineItems.reduce((acc, item) => acc + item.quantity, 0)})
        </span>
        <span>
          {formatPrice(
            cartLineItems.reduce(
              (acc, item) => acc + Number(item.price) * item.quantity,
              0,
            ),
          )}
        </span>
      </CardFooter>
    </Card>
  );
}

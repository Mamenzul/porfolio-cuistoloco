import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { products } from "@/server/db/schema";
import { env } from "@/env.js";
import { and, eq } from "drizzle-orm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UpdateProductForm } from "./_components/update-product-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Gérez vos produits",
  description: "Mettez à jour vos produits ou supprimez-les",
};

interface UpdateProductPageProps {
  params: {
    storeId: string;
    productId: string;
  };
}

export default async function UpdateProductPage({
  params,
}: UpdateProductPageProps) {
  const storeId = params.storeId;
  const productId = params.productId;

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.storeId, storeId)),
  });

  if (!product) {
    notFound();
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle as="h2" className="text-2xl">
          Mettre à jour vos produits
        </CardTitle>
        <CardDescription>
          Mettez à jour vos produits ou supprimez-les
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateProductForm product={product} />
      </CardContent>
    </Card>
  );
}

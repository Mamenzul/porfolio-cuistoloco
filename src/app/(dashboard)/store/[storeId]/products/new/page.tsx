import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { env } from "@/env.js";

import { getCachedUser } from "@/lib/queries/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CreateProductForm } from "./_components/create-product-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Nouveau produit",
  description: "Ajouter un nouveau produit",
};

interface NewProductPageProps {
  params: {
    storeId: string;
  };
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const storeId = decodeURIComponent(params.storeId);

  const user = await getCachedUser();

  if (!user) {
    redirect("/sigin");
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Nouveau produit</CardTitle>
        <CardDescription>Ajouter un nouveau produit</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateProductForm storeId={storeId} />
      </CardContent>
    </Card>
  );
}

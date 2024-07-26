import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

interface ProductNotFoundProps {
  params: {
    storeId: string;
  };
}

export default function ProductNotFound({ params }: ProductNotFoundProps) {
  const storeId = Number(params.storeId);

  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Produit non trouvé"
        description="Le produit que vous recherchez n'existe pas."
        retryLink={`/store/${storeId}/products`}
        retryLinkText="Aller voir les produits de la boutique"
      />
    </Shell>
  );
}

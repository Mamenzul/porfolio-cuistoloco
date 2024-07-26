import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

export default function ProductNotFound() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Produit introuvable"
        description="Le produit que vous recherchez n'existe pas."
        retryLink="/"
        retryLinkText="Revenir à l'accueil"
      />
    </Shell>
  );
}

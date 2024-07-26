import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

export default function StoreNotFound() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Boutique introuvable"
        description="La boutique que vous recherchez n'existe pas."
        retryLink="/"
        retryLinkText="Revenir à l'accueil"
      />
    </Shell>
  );
}

import Image from "next/image";
import type { StoredFile } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmptyCard } from "@/components/empty-card";

interface FilesProps {
  files: StoredFile[];
}

export function Files({ files }: FilesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fichiers téléversés</CardTitle>
        <CardDescription>Voir les fichiers téléversés ici</CardDescription>
      </CardHeader>
      <CardContent>
        {/* {files.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className="flex w-max space-x-2.5">
              {files.map((file) => (
                <div key={file.id} className="relative aspect-video w-64">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    sizes="(min-width: 640px) 640px, 100vw"
                    loading="lazy"
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : ( */}
        <EmptyCard
          title="Pas de fichier téléversé"
          description="Téléversez des fichiers pour les voir ici"
          className="w-full"
        />
        {/* )} */}
      </CardContent>
    </Card>
  );
}

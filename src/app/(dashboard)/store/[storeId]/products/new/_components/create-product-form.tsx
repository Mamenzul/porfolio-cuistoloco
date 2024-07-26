"use client";

import * as React from "react";
import type { StoredFile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addProduct } from "@/lib/actions/product";
import { getErrorMessage } from "@/lib/handle-error";
import {
  createProductSchema,
  type CreateProductSchema,
} from "@/lib/validations/product";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/file-uploader";
import { Files } from "@/components/files";
import { Icons } from "@/components/icons";
import Link from "next/link";

interface CreateProductFormProps {
  storeId: string;
}

export function CreateProductForm({ storeId }: CreateProductFormProps) {
  const [loading, setLoading] = React.useState(false);
  const { uploadFiles, progresses, uploadedFiles, isUploading } =
    useUploadFile("productImage");

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      inventory: NaN,
      images: [],
    },
  });

  function onSubmit(input: CreateProductSchema) {
    setLoading(true);

    toast.promise(
      uploadFiles(input.images ?? []).then(() => {
        return addProduct({
          ...input,
          storeId,
          images: JSON.stringify(uploadedFiles) as unknown as StoredFile[],
        });
      }),
      {
        loading: "Ajout du produit en cours...",
        success: () => {
          form.reset();
          setLoading(false);
          return "Product";
        },
        error: (err) => {
          setLoading(false);
          return getErrorMessage(err);
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Déterminez le nom du produit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Déterminez la description du produit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Déterminez le prix du produit"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Inventaire</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Déterminez la quantité en stock"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Uploadez des fichiers</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Uploadez vos fichiers</DialogTitle>
                          <DialogDescription>
                            Glissez et déposez vos fichiers ou cliquez pour les
                            parcourir.
                          </DialogDescription>
                        </DialogHeader>
                        <FileUploader
                          value={field.value ?? []}
                          onValueChange={field.onChange}
                          maxFiles={4}
                          maxSize={4 * 1024 * 1024}
                          progresses={progresses}
                          disabled={isUploading}
                        />
                      </DialogContent>
                    </Dialog>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {uploadedFiles.length > 0 ? (
                  <Files files={uploadedFiles} />
                ) : null}
              </div>
            )}
          />
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() =>
              void form.trigger(["name", "description", "price", "inventory"])
            }
            className="w-fit"
            disabled={loading}
          >
            {loading && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Ajouter le produit
            <span className="sr-only">Ajouter le produit</span>
          </Button>
          <Button variant="outline" className="h-fit w-fit" asChild>
            <Link href={`/store/${storeId}/products/`}>Retour</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

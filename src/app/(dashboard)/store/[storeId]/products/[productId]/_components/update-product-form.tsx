"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type Product } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { deleteProduct, updateProduct } from "@/lib/actions/product";
import { getErrorMessage } from "@/lib/handle-error";
import {
  updateProductSchema,
  type UpdateProductSchema,
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
  UncontrolledFormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/file-uploader";
import { Files } from "@/components/files";
import { Icons } from "@/components/icons";

interface UpdateProductFormProps {
  product: Product;
}

export function UpdateProductForm({ product }: UpdateProductFormProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "productImage",
    {
      defaultUploadedFiles: product.images ?? [],
    },
  );

  const form = useForm<UpdateProductSchema>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      inventory: product.inventory,
    },
  });

  function onSubmit(input: UpdateProductSchema) {
    setIsUpdating(true);

    toast.promise(
      uploadFiles(input.images ?? []).then(() => {
        return updateProduct({
          ...input,
          storeId: product.storeId,
          id: product.id,
        });
      }),
      {
        loading: "Uploading images...",
        success: () => {
          form.reset();
          setIsUpdating(false);
          return "Images uploaded";
        },
        error: (err) => {
          setIsUpdating(false);
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
            <FormItem className="w-full">
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
          <FormItem className="w-full">
            <FormLabel>Prix</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Déterminez le prix du produit ici"
                {...form.register("price")}
                defaultValue={product.price}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.price?.message}
            />
          </FormItem>
          <FormItem className="w-full">
            <FormLabel>Inventaire</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Déterminez la quantité en stock"
                {...form.register("inventory", {
                  valueAsNumber: true,
                })}
                defaultValue={product.inventory}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.inventory?.message}
            />
          </FormItem>
        </div>
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
                      <Button variant="outline">Uploader des fichiers</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Uploader des fichiers</DialogTitle>
                        <DialogDescription>
                          Glissez et déposez vos fichiers ici ou cliquez pour
                          les parcourir.
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
        <div className="flex space-x-2">
          <Button disabled={isDeleting || isUpdating}>
            {isUpdating && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Mettre à jour le produit
            <span className="sr-only">Mettre à jour le produit</span>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setIsDeleting(true);

              toast.promise(
                deleteProduct({
                  storeId: product.storeId,
                  id: product.id,
                }),
                {
                  loading: "Deleting product...",
                  success: () => {
                    void form.trigger(["name", "price", "inventory"]);
                    router.push(`/store/${product.storeId}/products`);
                    setIsDeleting(false);
                    return "Product deleted";
                  },
                  error: (err) => {
                    setIsDeleting(false);
                    return getErrorMessage(err);
                  },
                },
              );
            }}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Supprimer le produit
            <span className="sr-only">Supprimer le produit</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

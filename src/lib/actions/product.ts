"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/server/db";
import { products } from "@/server/db/schema";
import type { StoredFile } from "@/types";
import { and, eq } from "drizzle-orm";
import { type z } from "zod";

import { getErrorMessage } from "@/lib/handle-error";
import {
  type CreateProductSchema,
  type createProductSchema,
  type updateProductRatingSchema,
} from "@/lib/validations/product";

export async function addProduct(
  input: Omit<CreateProductSchema, "images"> & {
    storeId: string;
    images: StoredFile[];
  },
) {
  try {
    const productWithSameName = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: eq(products.name, input.name),
    });

    if (productWithSameName) {
      throw new Error("Product name already taken.");
    }

    await db.insert(products).values({
      ...input,
      images: JSON.stringify(input.images) as unknown as StoredFile[],
    });

    revalidatePath(`/store/${input.storeId}/products.`);

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateProduct(
  input: z.infer<typeof createProductSchema> & { id: string; storeId: string },
) {
  try {
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, input.id),
        eq(products.storeId, input.storeId),
      ),
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    await db
      .update(products)
      .set({
        ...input,
        images: JSON.stringify(input.images) as unknown as StoredFile[],
      })
      .where(eq(products.id, input.id));

    revalidatePath(`/store/${input.storeId}/products/${input.id}`);
    revalidatePath(`/${input.storeId}`);
    revalidateTag(`products-from-store-${input.storeId}`);

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteProduct(input: { id: string; storeId: string }) {
  try {
    const product = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: and(
        eq(products.id, input.id),
        eq(products.storeId, input.storeId),
      ),
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    await db.delete(products).where(eq(products.id, input.id));

    revalidatePath(`/store/${input.storeId}/products`);

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

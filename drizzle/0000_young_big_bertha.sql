DO $$ BEGIN
 CREATE TYPE "public"."store_plan" AS ENUM('free', 'standard');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."product_status" AS ENUM('active', 'draft', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"plan" "store_plan" DEFAULT 'free' NOT NULL,
	"ends_at" timestamp,
	"cancel_plan_at_end" boolean DEFAULT false,
	"stripe_account_id" varchar,
	"stripe_customer_id" varchar,
	"product_limit" integer DEFAULT 10 NOT NULL,
	"tag_limit" integer DEFAULT 5 NOT NULL,
	"variant_limit" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug"),
	CONSTRAINT "stores_stripe_account_id_unique" UNIQUE("stripe_account_id"),
	CONSTRAINT "stores_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"store_connect_id" varchar,
	"stripe_customer_id" varchar NOT NULL,
	"store_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "customers_store_connect_id_unique" UNIQUE("store_connect_id"),
	CONSTRAINT "customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"images" json DEFAULT 'null'::json,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"original_price" numeric(10, 2) DEFAULT '0',
	"inventory" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"store_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"store_id" varchar(30) NOT NULL,
	"items" json DEFAULT 'null'::json,
	"quantity" integer,
	"amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"stripe_payment_intent_status" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"store_id" varchar(30) NOT NULL,
	"stripe_account_id" varchar(256) NOT NULL,
	"stripe_account_created_at" timestamp,
	"stripe_account_expires_at" timestamp,
	"details_submitted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variant_values" (
	"product_variant_id" varchar(30) NOT NULL,
	"value" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "product_variant_values_pk" PRIMARY KEY("product_variant_id","value")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variants" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"product_id" varchar(30) NOT NULL,
	"variant_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variants" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"store_id" varchar(30) NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "variants_name_store_id_unique" UNIQUE NULLS NOT DISTINCT("name","store_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stocks" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"product_variant_id" varchar(30) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"payment_intent_id" varchar(256),
	"client_secret" text,
	"items" json DEFAULT 'null'::json,
	"closed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(36),
	"email" text NOT NULL,
	"token" text NOT NULL,
	"referred_by" text,
	"communication" boolean DEFAULT false NOT NULL,
	"newsletter" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "notifications_email_unique" UNIQUE("email"),
	CONSTRAINT "notifications_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variant_values" ADD CONSTRAINT "product_variant_values_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variant_values" ADD CONSTRAINT "product_variant_values_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variants" ADD CONSTRAINT "variants_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stocks" ADD CONSTRAINT "stocks_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "stores" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_store_id_idx" ON "customers" ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_stripe_customer_id_idx" ON "customers" ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_store_id_idx" ON "products" ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_store_id_idx" ON "orders" ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_store_id_idx" ON "payments" ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "variant_values_product_variant_id_idx" ON "product_variant_values" ("product_variant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "variant_values_stock_id_idx" ON "product_variant_values" ("stock_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_variants_product_id_idx" ON "product_variants" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_variants_variant_id_idx" ON "product_variants" ("variant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "variants_store_id_idx" ON "variants" ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stocks_product_variant_id_idx" ON "stocks" ("product_variant_id");
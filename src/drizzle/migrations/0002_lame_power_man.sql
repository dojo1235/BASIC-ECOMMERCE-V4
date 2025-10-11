ALTER TABLE "orders" ADD COLUMN "restoredBy" bigint;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "restoredAt" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "restoredBy" bigint;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "restoredAt" timestamp;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "restoredBy" bigint;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "restoredAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "restoredBy" bigint;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "restoredAt" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restoredBy_users_id_fk" FOREIGN KEY ("restoredBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_restoredBy_users_id_fk" FOREIGN KEY ("restoredBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restoredBy_users_id_fk" FOREIGN KEY ("restoredBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_restoredBy_users_id_fk" FOREIGN KEY ("restoredBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
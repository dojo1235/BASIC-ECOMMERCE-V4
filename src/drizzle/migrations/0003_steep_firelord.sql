ALTER TABLE "users" ADD COLUMN "bannedBy" bigint;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bannedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unbannedBy" bigint;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unbannedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_bannedBy_users_id_fk" FOREIGN KEY ("bannedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_unbannedBy_users_id_fk" FOREIGN KEY ("unbannedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
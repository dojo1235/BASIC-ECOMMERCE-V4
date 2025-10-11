ALTER TABLE "refresh_tokens" ADD COLUMN "revokedBy" bigint;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "revokedAt" timestamp;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_revokedBy_users_id_fk" FOREIGN KEY ("revokedBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP COLUMN "updatedAt";
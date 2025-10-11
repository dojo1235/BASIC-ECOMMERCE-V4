ALTER TABLE "users" DROP CONSTRAINT "users_unbannedBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "unbannedBy";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "unbannedAt";
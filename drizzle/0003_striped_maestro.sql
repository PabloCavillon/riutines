CREATE TYPE "public"."repeat_type" AS ENUM('month_day', 'business_day');--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "time" time;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "time" time;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "repeat" "repeat_type";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "repeat_n" smallint;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "repeat_has_n" CHECK (("tasks"."repeat" IS NULL AND "tasks"."repeat_n" IS NULL) OR ("tasks"."repeat" IS NOT NULL AND "tasks"."repeat_n" IS NOT NULL AND "tasks"."repeat_n" <> 0 AND "tasks"."repeat_n" BETWEEN -31 AND 31));
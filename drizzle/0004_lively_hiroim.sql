ALTER TYPE "public"."repeat_type" ADD VALUE 'weekday';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "repeat_weekday" smallint;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "repeat_weekday_match" CHECK ((coalesce("tasks"."repeat"::text, '') = 'weekday') = ("tasks"."repeat_weekday" IS NOT NULL) AND "tasks"."repeat_weekday" BETWEEN 0 AND 6);
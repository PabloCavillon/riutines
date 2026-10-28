CREATE TYPE "public"."frequency_type" AS ENUM('daily', 'weekdays');--> statement-breakpoint
CREATE TYPE "public"."log_status" AS ENUM('done', 'missed', 'skipped');--> statement-breakpoint
CREATE TABLE "daily_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"habit_id" integer,
	"task_id" integer,
	"status" "log_status" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_logs_date_habit_id_unique" UNIQUE("date","habit_id"),
	CONSTRAINT "daily_logs_date_task_id_unique" UNIQUE("date","task_id"),
	CONSTRAINT "one_target" CHECK (num_nonnulls("daily_logs"."habit_id", "daily_logs"."task_id") = 1)
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"emoji" text,
	"frequency_type" "frequency_type" DEFAULT 'daily' NOT NULL,
	"weekdays" integer[],
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reflections" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reflections_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"due_date" date NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
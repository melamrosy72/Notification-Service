CREATE TYPE "public"."platform" AS ENUM('ios', 'android', 'web');--> statement-breakpoint
CREATE TABLE "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar NOT NULL,
	"token" text NOT NULL,
	"platform" "platform" NOT NULL,
	"model" text,
	"brand" text,
	"version" text,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "devices_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "notification_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar,
	"title" varchar NOT NULL,
	"body" text NOT NULL,
	"data" json,
	"notification_status" "notification_status" DEFAULT 'queued',
	"message_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_device_id_devices_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("device_id") ON DELETE set null ON UPDATE no action;
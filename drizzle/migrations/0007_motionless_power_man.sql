ALTER TABLE "properties" ADD COLUMN "telephone" text;--> statement-breakpoint
ALTER TABLE "residencies" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "residencies" ADD COLUMN "verifycode" text;--> statement-breakpoint
ALTER TABLE "residents" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "residencies" ADD CONSTRAINT "residencies_email_unique" UNIQUE("email");
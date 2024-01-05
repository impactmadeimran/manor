CREATE TABLE IF NOT EXISTS "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"number" text NOT NULL,
	"rooms" integer NOT NULL,
	"residencyId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "residencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"numberOfProperties" integer NOT NULL,
	CONSTRAINT "residencies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "residents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userType" "userType" NOT NULL,
	"propertyId" uuid,
	"residentId" uuid NOT NULL,
	CONSTRAINT "residents_username_unique" UNIQUE("username"),
	CONSTRAINT "residents_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "property";--> statement-breakpoint
DROP TABLE "users";
CREATE TABLE "main_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"time_count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"parent_id" integer NOT NULL,
	"time_count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "main_skills" ADD CONSTRAINT "main_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_skills" ADD CONSTRAINT "sub_skills_parent_id_main_skills_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."main_skills"("id") ON DELETE cascade ON UPDATE no action;
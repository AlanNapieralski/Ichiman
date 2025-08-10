CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"time_count" integer NOT NULL,
	"parent_id" integer,
	"description" text,
	CONSTRAINT "skills_user_id_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
DROP TABLE "main_skills" CASCADE;--> statement-breakpoint
DROP TABLE "sub_skills" CASCADE;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_parent_id_skills_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
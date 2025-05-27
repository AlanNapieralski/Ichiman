import { integer, pgTable, varchar, time, serial } from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(), // serial is shorthand for identity column
    name: varchar("name", { length: 255 }).notNull(),
});

// Main skills table
export const mainSkillsTable = pgTable("main_skills", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" }) // optional: onDelete
        .notNull(),
});

// Sub-skills table
export const subSkillsTable = pgTable("sub_skills", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    parentId: integer("parent_id")
        .references(() => mainSkillsTable.id, { onDelete: "cascade" }) // FK to main skill
        .notNull(),
    timeCount: time("time_count", { precision: 0 }), // optional: adjust precision
});

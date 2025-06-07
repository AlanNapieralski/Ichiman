import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
});

// Main skills table
export const mainSkillsTable = pgTable("main_skills", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    timeCount: integer("time_count")
        .notNull()
});

// Sub-skills table
export const subSkillsTable = pgTable("sub_skills", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    parentId: integer("parent_id")
        .references(() => mainSkillsTable.id, { onDelete: "cascade" })
        .notNull(),
    timeCount: integer("time_count")
        .notNull()
});

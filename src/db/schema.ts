import { integer, pgTable, varchar, serial, unique, foreignKey } from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
});

// Main skills table
export const skillsTable = pgTable("skills", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    timeCount: integer("time_count")
        .notNull(),
    parentId: integer("parent_id"),
}, (table) => ({
    uniqueNamePerUser: unique().on(table.userId, table.name),
    parentIdFk: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
    }).onDelete("cascade"),
})
)

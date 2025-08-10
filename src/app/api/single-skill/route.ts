import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { skillsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import type { Skill } from "@/models/skill";

const db = drizzle(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    try {
        if (!id) {
            return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
        }

        const skill = await db
            .select()
            .from(skillsTable)
            .where(eq(skillsTable.id, Number(id)))
            .then((result) => result[0]) as Skill | undefined;

        if (!skill) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 });
        }

        return NextResponse.json(skill);
    } catch (error) {
        console.error("GET /api/single-skill error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


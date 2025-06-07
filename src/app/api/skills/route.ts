import { NextRequest, NextResponse } from "next/server"
import { drizzle } from 'drizzle-orm/node-postgres'
import { mainSkillsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL!)

export async function GET() {
    const skills = await db.select().from(mainSkillsTable)
    return NextResponse.json(skills)
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate incoming data
        const { name, userId, timeCount } = body;

        if (!name || !userId || timeCount == null) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Create skill object
        const newSkill: typeof mainSkillsTable.$inferInsert = {
            name,
            userId,
            timeCount,
        };

        // Insert into DB
        const result = await db.insert(mainSkillsTable).values(newSkill).returning();

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('POST /api/skills error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

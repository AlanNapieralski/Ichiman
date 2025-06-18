import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { skillsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import type { Skill } from "@/app/skills/page";
import type { ComplexSkill } from "@/app/skills/page";

const db = drizzle(process.env.DATABASE_URL!);

function combineSkills(skills: Skill[]): ComplexSkill[] {
    const subSkills: Skill[] = skills.filter(skill => skill.parentId);

    const res = skills
        .filter(skill => !skill.parentId)
        .map(skill => ({
            ...skill,
            subSkill: subSkills.filter(subSkill => subSkill.parentId === skill.id)
        }))

    return res
}

// GET: Fetch all main skills
export async function GET() {
    const skills = await db.select().from(skillsTable) as Skill[]

    const res = combineSkills(skills)

    return NextResponse.json(res);
}

// POST: Add a new main skill
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, userId, timeCount, parentId } = body;

        if (!name || !userId || timeCount == null) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newSkill = {
            name,
            userId,
            timeCount,
            parentId
        };

        const result = await db.insert(skillsTable).values(newSkill).returning();
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error("POST /api/main-skills error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


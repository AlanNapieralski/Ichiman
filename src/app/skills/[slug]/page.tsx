import { db } from "@/db";
import { skillsTable } from "@/db/schema";
import type { Skill } from "@/models/skill";
import { SkillCard } from "@/components/ui/skill-card";
import SkillActions from "@/components/ui/skill-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { rankData, rankDataArr, type Rank } from "@/models/RankToProgressMap";

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ slug: string }>
}

function slugify(name: string): string {
    return encodeURIComponent(name.toLowerCase().trim().replace(/\s+/g, "-"));
}

function buildSkillTree(skills: Skill[]): Skill[] {
    const idToSkill = new Map<number, Skill>();
    const parentIdToChildren = new Map<number, Skill[]>();

    for (const skill of skills) {
        idToSkill.set(skill.id, { ...skill, subSkills: undefined });
        if (skill.parentId != null) {
            const list = parentIdToChildren.get(skill.parentId) ?? [];
            list.push(skill);
            parentIdToChildren.set(skill.parentId, list);
        }
    }

    function attachChildren(skill: Skill): Skill {
        const children = parentIdToChildren.get(skill.id) ?? [];
        return {
            ...skill,
            subSkills: children.map((child) => attachChildren(child)),
        };
    }

    // Only return roots
    const roots = skills.filter((s) => !s.parentId);
    return roots.map((r) => attachChildren(r));
}

async function fetchAllSkills(): Promise<Skill[]> {
    const rows = await db.select().from(skillsTable) as Skill[];
    return rows;
}

function findSkillBySlugInTree(trees: Skill[], slug: string): Skill | undefined {
    const queue: Skill[] = [...trees];
    const normalized = slug.toLowerCase();
    while (queue.length > 0) {
        const current = queue.shift()!;
        if (slugify(current.name) === normalized) return current;
        if (current.subSkills) queue.push(...current.subSkills);
    }
    return undefined;
}

const SkillPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    const allSkills = await fetchAllSkills();
    const trees = buildSkillTree(allSkills);
    const skill = findSkillBySlugInTree(trees, slug);
    if (!skill) return notFound();

    // Build quick lookup for parents
    const idToSkill = new Map<number, Skill>(allSkills.map((s) => [s.id, s]));

    function formatTime(seconds: number): string {
        if (seconds < 3600) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")} min`;
        } else if (seconds < 360000) {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            return `${String(hours).padStart(2, "0")} h ${String(mins).padStart(2, "0")} m`;
        } else {
            const hours = Math.floor(seconds / 3600);
            return `${hours.toLocaleString()} h`;
        }
    }

    function totalTimeSeconds(root: Skill): number {
        const childrenTime = (root.subSkills ?? []).reduce((sum, child) => sum + totalTimeSeconds(child), 0);
        return root.timeCount + childrenTime;
    }

    function getRank(totalSeconds: number): Rank {
        const entry = rankDataArr.find(([, info]) => totalSeconds >= info.goal);
        return entry ? entry[0] : "loading";
    }

    function getBreadcrumbPath(cur: Skill): Skill[] {
        const path: Skill[] = [];
        let node: Skill | undefined = cur;
        while (node) {
            path.unshift(node);
            if (node.parentId == null) break;
            node = idToSkill.get(node.parentId);
        }
        return path;
    }

    const cumulativeSeconds = totalTimeSeconds(skill);
    const currentRank = getRank(cumulativeSeconds);
    const nextRank = rankData[currentRank].nextRank;
    const currentGoal = rankData[currentRank].goal;
    const nextGoal = nextRank ? rankData[nextRank].goal : null;
    const progressToNext = nextGoal
        ? Math.min(100, Math.max(0, ((cumulativeSeconds - currentGoal) / (nextGoal - currentGoal)) * 100))
        : 100;
    const remainingToNext = nextGoal ? Math.max(0, nextGoal - cumulativeSeconds) : 0;
    const breadcrumb = getBreadcrumbPath(skill);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-bold">{skill.name}</h1>
                <span className="text-gray-500">/skills/{slug}</span>
            </div>
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2">
                    <li>
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="text-gray-400">/</li>
                    {breadcrumb.map((node, idx) => {
                        const nodeSlug = slugify(node.name);
                        const isLast = idx === breadcrumb.length - 1;
                        return (
                            <li key={node.id} className="flex items-center gap-2">
                                {!isLast ? (
                                    <Link href={`/skills/${nodeSlug}`} className="hover:underline">
                                        {node.name}
                                    </Link>
                                ) : (
                                    <span className="font-medium">{node.name}</span>
                                )}
                                {!isLast && <span className="text-gray-400">/</span>}
                            </li>
                        );
                    })}
                </ol>
            </nav>
            <div className="flex flex-col gap-3">
                <SkillCard skill={skill} />
                <SkillActions skill={skill} />
            </div>
            {/* Description */}
            {skill.description ? (
                <section className="rounded-xl border border-gray-200 bg-white p-4">
                    <h2 className="text-sm uppercase text-gray-500">Description</h2>
                    <p className="mt-1 text-gray-800 whitespace-pre-line">{skill.description}</p>
                </section>
            ) : null}
            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs uppercase text-gray-500">Total Time</div>
                    <div className="mt-1 text-2xl font-semibold">{formatTime(cumulativeSeconds)}</div>
                    <div className="text-xs text-gray-500">Includes subskills</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs uppercase text-gray-500">Current Rank</div>
                    <div className="mt-1 text-2xl font-semibold capitalize">{currentRank}</div>
                    {nextRank && (
                        <div className="text-xs text-gray-500">Next: {nextRank}</div>
                    )}
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs uppercase text-gray-500">To Next Rank</div>
                    <div className="mt-1 text-2xl font-semibold">{Math.floor(progressToNext)}%</div>
                    {nextGoal && (
                        <div className="text-xs text-gray-500">{formatTime(remainingToNext)} remaining</div>
                    )}
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs uppercase text-gray-500">Subskills</div>
                    <div className="mt-1 text-2xl font-semibold">{skill.subSkills?.length ?? 0}</div>
                    <div className="text-xs text-gray-500">ID #{skill.id} • User {skill.userId}</div>
                </div>
            </section>
        </div>
    );
}

export default SkillPage

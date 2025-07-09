import { fetchSkills } from "@/lib/skills/utils";

type PageProps = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const slugs = await fetchAllSkillSlugs()
    return slugs.map((skill) => ({ slug: skill }))
}

async function fetchAllSkillSlugs() {
    const skills = await fetchSkills()
    return skills.map(skill => encodeURIComponent(skill.name.toLowerCase().replace(/\s+/g, "-")))
}

const SkillPage = async ({ params }: PageProps) => {
    const { slug } = await params
    return (
        <div>
            <h1>{slug}</h1>
        </div>
    )
}

export default SkillPage

import ClientSkillsPage from "@/components/client-skills-page"
import { fetchSkills } from "@/lib/skills/utils"

export type Skill = {
    id: number,
    name: string,
    timeCount: number
    userId: number
    parentId?: number
    subSkill?: Skill[]
}

const SkillsPage = async () => {
    const skills = await fetchSkills()

    return (
        <ClientSkillsPage initialSkills={skills} />
    )
}

export default SkillsPage

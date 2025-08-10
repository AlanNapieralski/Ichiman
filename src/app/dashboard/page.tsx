import ClientSkillsPage from "@/components/client-skills-page"
import { fetchSkills } from "@/lib/skills/utils"
import type { Skill } from "@/models/skill"

const SkillsPage = async () => {
    const skills: Skill[] = await fetchSkills()

    return (
        <ClientSkillsPage initialSkills={skills} />
    )
}

export default SkillsPage

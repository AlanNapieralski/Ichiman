"use client"
import { useState } from "react"
import AddSkillPopup from "@/components/add-skill-popup"
import ProgressPanel from "@/components/ui/progress-panel"
import { Skill } from "@/app/skills/dashboard/page"

interface Props {
    initialSkills: Skill[]
}

export default function ClientSkillsPage({ initialSkills }: Props) {
    const [skills, setSkills] = useState<Skill[]>(initialSkills)

    const refreshSkills = async () => {
        const res = await fetch("/api/main-skills")
        const updated = await res.json()
        setSkills(updated)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <AddSkillPopup
                skills={skills}
                onAddSkill={refreshSkills}
            />
            <div className="min-h-[100vh] flex flex-col gap-4 p-4">
                {skills
                    .filter(skill => !skill.parentId)
                    .map(skill => (
                        <ProgressPanel key={skill.id} skill={skill} className="h-20" />
                    ))}
            </div>
        </div>
    )
}

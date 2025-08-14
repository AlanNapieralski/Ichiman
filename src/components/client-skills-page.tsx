"use client"
import { useState } from "react"
import AddSkillPopup from "@/components/add-skill-popup"
import { useEffect } from "react"
import { useTimerStore } from "@/hooks/timerStore"
import { SkillCard } from "@/components/ui/skill-card"
import type { Skill } from "@/models/skill"

interface Props {
    initialSkills: Skill[]
}

export default function ClientSkillsPage({ initialSkills }: Props) {
    const [skills, setSkills] = useState<Skill[]>(initialSkills)
    const syncTimersWithSkills = useTimerStore((s) => s.syncTimersWithSkills)

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
            <SyncTimers skills={skills} onSync={syncTimersWithSkills} />
            <div className="min-h-[100vh] flex flex-col gap-4 p-4">
                {skills
                    .filter(skill => !skill.parentId)
                    .map(skill => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}
            </div>
        </div>
    )
}

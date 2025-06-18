'use client'
import ProgressPanel from "@/components/ui/progress-panel"

import { rankDataArr } from "@/models/RankToProgressMap"
import AddSkillPopup from "@/components/add-skill-popup"
import { useEffect, useState } from "react"

export type Skill = {
    id: number,
    name: string,
    timeCount: number
    userId: number
    parentId?: number
    subSkill?: Skill[]
}

async function fetchSkills(): Promise<Skill[]> {
    const res = await fetch("/api/main-skills")
    return await res.json()
}

const SkillsPage = () => {
    const [skillList, setSkillList] = useState<Skill[]>([])

    const loadSkills = async () => {
        const skills = await fetchSkills();
        setSkillList(skills);
    }

    useEffect(() => {
        loadSkills()
    }, [])

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <AddSkillPopup
                skills={skillList}
                onAddSkill={() => loadSkills()}
            />
            <div className="min-h-[100vh] flex-1 flex flex-col items-start rounded-xl bg-muted/50 md:min-h-min p-8 bg-red-50">
                {skillList.map((skill) => {
                    if (skill.parentId) {
                        return null;
                    }

                    return <ProgressPanel key={skill.id} skill={skill} className="" />
                })}
            </div>
        </div>
    )
}


export default SkillsPage

'use client'
import ProgressPanel from "@/components/ui/progress-panel"

import { rankDataArr } from "@/models/RankToProgressMap"
import { Rank } from "@/models/RankToProgressMap"
import AddSkillPopup from "@/components/add-skill-popup"
import { useEffect, useState } from "react"

type Skill = {
    id: number,
    name: string,
    timeCount: number
}

const fetchSkills = async () => {
    const res = await fetch("/api/skills")
    return await res.json()
}

function getRank(timeCount: number): Rank | null {
    const result = rankDataArr.slice().reverse().find(item => {
        return timeCount >= item[1].goal;
    })

    return result ? result[0] as Rank : null;
}

const SkillsPage = () => {
    const [skillList, setSkillList] = useState<Skill[]>([])

    const loadSkills = async () => {
        const data = await fetchSkills()
        setSkillList(data)
    }

    useEffect(() => {
        loadSkills()
    }, [])

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <AddSkillPopup
                parentSkills={["Frontend Development", "Backend Development", "Data Science", "DevOps", "Mobile Development"]}
                onAddSkill={() => loadSkills()}
            />
            <div className="min-h-[100vh] flex-1 flex flex-col items-start rounded-xl bg-muted/50 md:min-h-min p-8 bg-red-50">
                {skillList.map((item, index) => {
                    const rank: Rank = getRank(item.timeCount) as Rank
                    console.log(rank)
                    return <ProgressPanel key={index} text={item.name} rank={rank} initialSeconds={item.timeCount} className="" />
                })}
            </div>
        </div>
    )
}


export default SkillsPage

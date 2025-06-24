import ClientSkillsPage from "@/components/client-skills-page"

export type Skill = {
    id: number,
    name: string,
    timeCount: number
    userId: number
    parentId?: number
    subSkill?: Skill[]
}

const SkillsPage = async () => {
    const res = await fetch("http://localhost:3000/api/main-skills", {
        cache: "no-store", // optional if you want SSR fresh data
    })

    let skills: Skill[]

    if (!res.ok) {
        const error = await res.json()
        console.log("No results:", error)
        skills = []
    } else {
        skills = await res.json()
    }


    return (
        <ClientSkillsPage initialSkills={skills} />
    )
}

export default SkillsPage

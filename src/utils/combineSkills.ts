import { Skill } from "@/models/skill";

export default function combineSkills(skills: Skill[]) {
    const subSkills: Skill[] = skills.filter(skill => skill.parentId);

    const res = skills
        .filter(skill => !skill.parentId)
        .map(skill => ({
            ...skill,
            subSkills: subSkills.filter(subSkill => subSkill.parentId === skill.id)
        }))

    return res
}



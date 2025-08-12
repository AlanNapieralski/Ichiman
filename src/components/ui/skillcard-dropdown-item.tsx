import { useTimerStore } from "@/hooks/timerStore";
import { SkillCard } from "./skill-card";
import type { Skill } from "@/models/skill";

type SkillCardDropdownItemProps = {
    sub: Skill
}

export default function SkillCardDropdownItem({ sub }: SkillCardDropdownItemProps) {
    const time = useTimerStore((state) => state.timers[sub.id]?.time || 0)


    return (
        <>
            <SkillCard version="dropdown" skill={sub} className="bg-transparent min-w-[35%]" />

            <div className="text-center px-4">
                <div className="text-2xl font-bold text-gray-900">{Math.floor(time / 3600)}</div>
                <div className="text-xs text-gray-500">hours</div>
            </div>
        </>
    )
}



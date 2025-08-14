"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Skill } from "@/models/skill"
import { useTimerStore } from "@/hooks/timerStore"
import { Rank, rankDataArr } from "@/models/RankToProgressMap"
import { calculateClampedProgress } from "@/utils/calculateClampedProgress"
import { formatTime } from "@/utils/time/formatTime"
import SkillProgressBar from "@/components/ui/skill-progress-bar"
import SkillCardDropdownItem from "./skillcard-dropdown-item"

type SkillCardPropsType = {
    skill: Skill
    version?: "original" | "dropdown"
    className?: string
}

export function SkillCard({ skill, version = "original", className = "" }: SkillCardPropsType) {
    const id = skill.id
    const isParent = Boolean(skill.subSkills && skill.subSkills.length > 0)

    const [expanded, setExpanded] = useState(false)
    const [displayTime, setDisplayTime] = useState(0)

    const { activateTimer, getChildTime, startTimer, stopTimer } = useTimerStore()
    const timer = useTimerStore((state) => state.timers[id])
    const time = useTimerStore((state) => state.timers[id]?.time || 0)

    function getRank(timeCount: number): Rank {
        const entry = rankDataArr.find(([, obj]) => timeCount >= obj.goal)
        return entry ? entry[0] : "loading"
    }

    const rank: Rank = useMemo(() => getRank(time), [time])
    const clampedProgress = useMemo(() => calculateClampedProgress(rank, time), [rank, time])

    const onToggleRun = () => {
        if (!timer?.isRunning) startTimer(id)
        else stopTimer(id)
    }

    useEffect(() => {
        activateTimer(id, skill, skill.timeCount, skill.parentId)
        return () => {
            stopTimer(id)
        }
    }, [activateTimer, id, skill, stopTimer])

    useEffect(() => {
        if (!timer) return
        const updateDisplayTime = () => {
            const initTime = isParent ? timer.time + getChildTime(id) : timer.time
            if (timer.isRunning) {
                const now = Date.now()
                const elapsed = Math.floor((now - (timer.lastStartedAt ?? now)) / 1000)
                setDisplayTime(initTime + elapsed)
            } else {
                setDisplayTime(initTime)
            }
        }
        updateDisplayTime()
        const interval = setInterval(updateDisplayTime, 1000)

        return () => clearInterval(interval)
    }, [getChildTime, id, isParent, timer])

    return (
        <>
            <Card
                className={`hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden ${timer?.isRunning ? "scale-[1.02] shadow-lg ring-2 ring-blue-200" : ""
                    } ${className}`}
                onClick={onToggleRun}
            >
                <CardContent className="p-4 relative z-10">
                    <div className="flex items-center gap-4">

                        {/* The color indicator */}
                        {version === "original" &&
                            <div className={`w-1 h-14 rounded-full ${timer?.isRunning ? "bg-red-500" : "bg-gray-300"}`} />
                        }
                        {/* Title line */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">{skill.name}</h3>
                                <Badge className="bg-gray-100 text-gray-800">{rank}</Badge>
                                {isParent && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="expand-button p-1 h-6 w-6 bg-black skibidi"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setExpanded((prev) => !prev)
                                        }}
                                    >
                                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </Button>
                                )}
                            </div>

                            {/* Time and Running flag */}
                            {version === "original" &&
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600 font-mono">{formatTime(displayTime)}</span>
                                </div>
                            }

                            {/* Progress bar */}
                            <div className="space-y-1">
                                {version === "original" &&
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Progress to next rank</span>
                                        <span>{Math.floor(clampedProgress)}%</span>
                                    </div>
                                }
                                <SkillProgressBar value={clampedProgress} />
                            </div>

                        </div>

                        {version === "dropdown" &&
                            <span className="text-md text-gray-600 font-mono px-4">{formatTime(displayTime)}</span>
                        }

                        {/* Hours display */}
                        {version === "original" &&
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{Math.floor(displayTime / 3600)}</div>
                                <div className="text-xs text-gray-500">hours</div>
                            </div>
                        }
                    </div>

                </CardContent>
            </Card>
            {
                (isParent && expanded &&
                    <div className="flex flex-col gap-3 ml-6">
                        {skill.subSkills?.map((sub) => {

                            return (
                                <div key={sub.id} className="flex justify-between items-center">
                                    <SkillCardDropdownItem sub={sub} />
                                </div>
                            )
                        })}
                    </div>
                )
            }
        </>
    )
}

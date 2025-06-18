'use client'
import { Skill } from "@/app/skills/page"
import { useTimerStore } from "@/hooks/timerStore"
import { Rank, rankDataArr } from "@/models/RankToProgressMap"
import { progressFillClassMap } from "@/models/progressBarData"
import { useState, useEffect } from "react"

export interface ProgressPanelProps {
    skill: Skill
    className?: string
}

const findRankUpperBound = (rank: Rank): number => {
    const rankIndex = rankDataArr.findIndex((item) => item[0] === rank);
    return rankDataArr[rankIndex + 1]?.[1]?.goal ?? 100;
}

const formatTime = (seconds: number): string => {
    if (seconds < 3600) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")} min`
    } else if (seconds < 360000) {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        return `${String(hours).padStart(2, "0")} h ${String(mins).padStart(2, "0")} m`
    } else {
        const hours = Math.floor(seconds / 3600)
        return `${hours.toLocaleString()} h`
    }
}

function getRank(timeCount: number): Rank | null {
    const result = rankDataArr.slice().reverse().find(item => {
        return timeCount >= item[1].goal;
    })

    return result ? result[0] as Rank : null;
}


export default function ProgressPanel({ skill, className = "" }: ProgressPanelProps) {
    // Ensure progress is between 0 and 100
    const id = skill.id
    const subSkills = skill.subSkill
    const isParent = subSkills ? true : false

    const [isActive, setIsActive] = useState(false)
    const [dropdown, setDropdown] = useState(false)
    const [clampedProgress, setClampedProgress] = useState(0)
    const [childRunning, setChildRunning] = useState(false)

    const { getTotalTime, getTime, startTimer, stopTimer, setParentId, timers } = useTimerStore()

    const rank = getRank(getTime(id)) as Rank

    function updateProgressFill() {
        const upperBound = findRankUpperBound(rank)
        let progress
        if (!upperBound) { // master
            progress = 100
        } else {
            progress = (getTime(id) / upperBound) * 100
        }
        setClampedProgress(Math.floor(Math.min(Math.max(progress, 0), 100)))
    }

    useEffect(() => {
        if (isParent && skill.parentId)
            setParentId(id, skill.parentId)
    }, [])

    useEffect(() => {
        if (isActive) {
            startTimer(id)
        }
        if (!isActive) {
            stopTimer(id)
            updateProgressFill()
        }
    }, [isActive])

    useEffect(() => {
        setChildRunning(timers[id].isBlocked)
    }, [isActive])

    const onPanelClick = () => {
        if (isParent && childRunning) {
            return
        }
        setIsActive((prev) => !prev)
    }

    const onDropdown = () => {
        if (subSkills && subSkills.length > 0) {
            setDropdown((prev) => !prev)
        }
    }

    return (
        <div className="w-full">
            <div className={``}>
                <div className="w-full flex relative gap-4">
                    {/* Main panel container */}
                    <button disabled={childRunning} onClick={onPanelClick} className={`group m-2 relative h-24 w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl border border-gray-200 hover:border-gray-300 active:border-gray-400 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md active:shadow-lg active:scale-[0.98] transform ${isActive ? 'border-red-500 border-4' : ''} ${className}`}>
                        {/* Progress fill */}
                        <div
                            className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out rounded-xl ${progressFillClassMap[rank]}`}
                            style={{ width: `${clampedProgress}%` }}
                        />

                        {/* Text content */}
                        <div className="relative z-10 flex items-center justify-between h-full px-4">
                            <span className="font-bold text-2xl text-gray-800 group-hover:text-gray-900 group-active:text-black transition-colors duration-300">
                                {skill.name}
                            </span>
                            {getTime(id) && (
                                <span className="text-lg text-gray-600 group-hover:text-gray-700 group-active:text-gray-800 font-mono transition-colors duration-300">
                                    {subSkills ? formatTime(getTotalTime(id)) : formatTime(getTime(id))}
                                </span>
                            )}
                        </div>
                    </button>
                    {subSkills && subSkills.length > 0 ?
                        <button onClick={onDropdown} className="p-4 aspect-square bg-red-500 rounded-md">Press</button>
                        :
                        null
                    }
                </div>
                {/* Progress percentage indicator */}
                {isParent ?
                    <div className="mb-4 text-center">
                        <span className="text-sm text-gray-500">{clampedProgress.toFixed(0)}% complete</span>
                    </div>
                    :
                    null
                }
            </div>
            {isParent ?
                <div className={`min-h-[100vh] flex-1 flex flex-col items-start rounded-xl bg-muted/50 md:min-h-min bg-red-50 ${dropdown ? "hidden" : "block"}`}>
                    {subSkills?.map((subSkill) => {
                        return <ProgressPanel key={subSkill.id} skill={subSkill} className="h-1/2 w-2/3" />
                    })}
                </div>
                :
                null
            }
        </div>
    )
}

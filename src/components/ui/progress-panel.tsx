'use client'
import { Skill } from "@/models/skill"
import { calculateClampedProgress } from "@/utils/calculateClampedProgress"
import { useTimerStore } from "@/hooks/timerStore"
import { Rank, rankDataArr } from "@/models/RankToProgressMap"
import { progressFillClassMap } from "@/models/progressBarData"
import { useState, useEffect, useMemo } from "react"
import { formatTime } from "@/utils/time/formatTime"

export interface ProgressPanelProps {
    skill: Skill
    className?: string
}

function getRank(timeCount: number): Rank {
    const rank = rankDataArr.find(([, obj]) => timeCount >= obj.goal)
    if (!rank)
        return 'loading'

    return rank[0]
}


const ProgressPanel = ({ skill, className = "" }: ProgressPanelProps) => {
    const id = skill.id
    const subSkills = skill.subSkills
    const isParent = Boolean(subSkills && subSkills.length > 0)
    const parentId = isParent ? null : skill.parentId

    const [dropdown, setDropdown] = useState(false)
    const [displayTime, setDisplayTime] = useState(0)

    const { activateTimer, getChildTime, startTimer, stopTimer } = useTimerStore()
    const timer = useTimerStore((state) => state.timers[id])
    const time = useTimerStore((state) => state.timers[id]?.time || 0)
    const isRunning = useTimerStore((state) => !!state.timers[id]?.isRunning)

    const rank: Rank = useMemo(() => getRank(time), [time])

    const clampedProgress = useMemo(() => calculateClampedProgress(rank, time), [rank, time])

    const toggle = () => (isRunning ? stopTimer(id) : startTimer(id));

    const onDropdown = () => {
        if (subSkills && subSkills.length > 0) {
            setDropdown((prev) => !prev)
        }
    }

    useEffect(() => {
        activateTimer(id, skill, skill.timeCount, parentId)
        return () => {
            // ensure timers are stopped to avoid touching undefined parents in tests
            stopTimer(id)
        }
    }, [activateTimer, id, isParent, parentId, skill, stopTimer])

    useEffect(() => {
        if (isRunning) {
            startTimer(id)
        } else {
            stopTimer(id)
        }
    }, [id, isRunning, startTimer, stopTimer])

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
        <div className="w-full">
            <div className={`w-full`}>
                <div className={`flex relative gap-4 ${className}`}>
                    {/* Main panel container */}
                    <button onClick={toggle} className={`group relative w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl border border-gray-200 hover:border-gray-300 active:border-gray-400 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md active:shadow-lg active:scale-[0.98] transform ${isRunning ? 'border-red-500 border-4' : ''}`}>
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
                            <span className="text-lg text-gray-600 group-hover:text-gray-700 group-active:text-gray-800 font-mono transition-colors duration-300">
                                {formatTime(displayTime)}
                            </span>
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
                        return <ProgressPanel key={subSkill.id} skill={subSkill} className="h-12 w-1/3 ml-8 mb-4" />
                    })}
                </div>
                :
                null
            }
        </div>
    )
}


export default ProgressPanel

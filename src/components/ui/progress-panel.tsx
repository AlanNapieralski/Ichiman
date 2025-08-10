'use client'
import { Skill } from "@/models/skill"
import { useTimerStore } from "@/hooks/timerStore"
import { Rank, rankDataArr } from "@/models/RankToProgressMap"
import { progressFillClassMap } from "@/models/progressBarData"
import { useState, useEffect } from "react"

export interface ProgressPanelProps {
    skill: Skill
    className?: string
}

function formatTime(seconds: number): string {
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

function getRank(timeCount: number): Rank {
    const rank = rankDataArr.find(([, obj]) => timeCount >= obj.goal)
    if (!rank)
        return 'loading'

    return rank[0]
}


const ProgressPanel = ({ skill, className = "" }: ProgressPanelProps) => {
    const id = skill.id
    const subSkills = skill.subSkill
    const isParent = subSkills ? true : false

    const [isActive, setIsActive] = useState(false)
    const [isRendered, setIsRendered] = useState(false)
    const [dropdown, setDropdown] = useState(false)
    const [clampedProgress, setClampedProgress] = useState(0)

    const { activateTimer, getChildTime, startTimer, stopTimer, setParentId } = useTimerStore()
    const timer = useTimerStore((state) => state.timers[id])
    const time = useTimerStore((state) => state.timers[id]?.time || 0)
    const isBlocked = useTimerStore((state) => state.timers[id]?.isBlocked || false)

    const [rank, setRank] = useState<Rank>("loading")
    const [displayTime, setDisplayTime] = useState(time)

    const onPanelClick = () => {
        setIsActive((prev) => !prev)
    }

    const onDropdown = () => {
        if (subSkills && subSkills.length > 0) {
            setDropdown((prev) => !prev)
        }
    }

    const updateProgressFill = (rank: Rank) => {
        const nextRank = rankDataArr.find(([name]) => rank === name)?.[1]?.nextRank
        const upperBound = rankDataArr.find(([name]) => name === nextRank)?.[1]?.goal

        if (nextRank === null) {
            setClampedProgress(100) // master
            return
        }
        if (upperBound === undefined) { // time has not started yet
            setClampedProgress(0)
            return
        }

        setClampedProgress((time / upperBound) * 100)
    }

    useEffect(() => {
        activateTimer(id, skill, skill.timeCount)
        if (!isParent && skill.parentId)
            setParentId(id, skill.parentId)
    }, [])

    useEffect(() => {
        if (isActive) {
            startTimer(id)
        }
        if (!isActive) {
            stopTimer(id)
        }
    }, [isActive])

    useEffect(() => {
        if (!timer) return;

        setRank(getRank(time))
        // Display Time initialisation
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

        if (!isRendered) {
            setIsRendered(true)
            updateDisplayTime()
        }

        const interval = setInterval(() => updateDisplayTime(), 1000)

        return () => clearInterval(interval)
    }, [timer])


    useEffect(() => {
        updateProgressFill(rank)
    }, [displayTime])

    return (
        <div className="w-full">
            <div className={`w-full`}>
                <div className={`flex relative gap-4 ${className}`}>
                    {/* Main panel container */}
                    <button disabled={isBlocked} onClick={onPanelClick} className={`group relative w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl border border-gray-200 hover:border-gray-300 active:border-gray-400 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md active:shadow-lg active:scale-[0.98] transform ${isActive ? 'border-red-500 border-4' : ''}`}>
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

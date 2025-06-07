'use client'
import { useTimer } from "@/hooks/useTimer"
import { Rank, rankDataArr } from "@/models/RankToProgressMap"
import { progressFillClassMap } from "@/models/progressBarData"
import { useState, useEffect } from "react"

export interface ProgressPanelProps {
    text: string
    rank: Rank
    initialSeconds: number
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

export default function ProgressPanel({ text, rank, initialSeconds, className = "" }: ProgressPanelProps) {
    // Ensure progress is between 0 and 100
    const [isActive, setIsActive] = useState(false)
    const [clampedProgress, setClampedProgress] = useState(0)
    const timer = useTimer(initialSeconds)

    useEffect(() => {
        if (!isActive) {
            const upperBound = findRankUpperBound(rank)
            let progress
            if (!upperBound) { // master
                progress = 100
            } else {
                progress = (timer.time / upperBound) * 100
                console.log(rank, progress)
            }
            setClampedProgress(Math.floor(Math.min(Math.max(progress, 0), 100)))
        }
    }, [isActive])

    useEffect(() => {
        if (isActive) {
            timer.start()
        }
        if (!isActive) {
            timer.stop()
        }
    }, [isActive])


    const onPanelClick = () => {
        setIsActive((prev) => !prev)
    }

    return (
        <div className={`relative w-full ${className}`}>
            {/* Main panel container */}
            <button onClick={onPanelClick} className={`group relative h-32 w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl border border-gray-200 hover:border-gray-300 active:border-gray-400 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md active:shadow-lg active:scale-[0.98] transform ${isActive ? 'border-red-500 border-4' : ''}`}>
                {/* Progress fill */}
                <div
                    className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out rounded-xl ${progressFillClassMap[rank]}`}
                    style={{ width: `${clampedProgress}%` }}
                />

                {/* Text content */}
                <div className="relative z-10 flex items-center justify-between h-full px-4">
                    <span className="font-bold text-2xl text-gray-800 group-hover:text-gray-900 group-active:text-black transition-colors duration-300">
                        {text}
                    </span>
                    {timer.time && (
                        <span className="text-lg text-gray-600 group-hover:text-gray-700 group-active:text-gray-800 font-mono transition-colors duration-300">
                            {formatTime(timer.time)}
                        </span>
                    )}
                </div>
            </button>

            {/* Progress percentage indicator */}
            <div className="mb-4 text-center">
                <span className="text-sm text-gray-500">{clampedProgress.toFixed(0)}% complete</span>
            </div>
        </div>
    )
}

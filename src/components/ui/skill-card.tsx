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
import { formatTime } from "@/utils/formatTime"

export type DashboardSubSkill = {
  name: string
  hours: number
  progress: number
  rank: string
}

export type DashboardSkill = {
  id: number
  name: string
  hours: number
  rank: string
  rankProgress: number
  weeklyHours: number
  lastSession: string
  color: string
  subSkills?: DashboardSubSkill[]
}

function getRankColor(rank: string) {
  switch (rank) {
    case "Beginner":
      return "bg-gray-100 text-gray-800"
    case "Intermediate":
      return "bg-blue-100 text-blue-800"
    case "Advanced":
      return "bg-purple-100 text-purple-800"
    case "Expert":
      return "bg-gold-100 text-gold-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getRankProgressColor(rank: string) {
  switch (rank) {
    case "Beginner":
      return "from-gray-400 to-gray-600"
    case "Intermediate":
      return "from-blue-400 to-blue-600"
    case "Advanced":
      return "from-purple-400 to-purple-600"
    case "Expert":
      return "from-yellow-400 to-yellow-600"
    default:
      return "from-gray-400 to-gray-600"
  }
}

function getRankBorderColor(rank: string) {
  switch (rank) {
    case "Beginner":
      return "border-gray-300 hover:border-gray-400"
    case "Intermediate":
      return "border-blue-300 hover:border-blue-400"
    case "Advanced":
      return "border-purple-300 hover:border-purple-400"
    case "Expert":
      return "border-yellow-300 hover:border-yellow-400"
    default:
      return "border-gray-300 hover:border-gray-400"
  }
}

export function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [animating, setAnimating] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [animatingSubSkills, setAnimatingSubSkills] = useState<Set<string>>(new Set())

  const onCardClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".expand-button")) return
    setAnimating((prev) => !prev)
  }

  const onExpandClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setExpanded((prev) => !prev)
  }

  const onSubSkillClick = (event: React.MouseEvent, subSkillName: string) => {
    event.stopPropagation()
    const key = `${skill.id}-${subSkillName}`
    setAnimatingSubSkills((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <Card
      className={`hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden ${animating ? "scale-[1.02] shadow-lg ring-2 ring-blue-200" : ""
        }`}
      onClick={onCardClick}
    >
      {animating && (
        <div className="absolute inset-0 rounded-lg">
          <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-orange-500 to-blue-500 bg-[length:400%_400%] animate-[gradient_2s_linear_infinite] opacity-75" />
          <div className="absolute inset-[2px] bg-white rounded-lg" />
        </div>
      )}

      <CardContent className="p-4 relative z-10">
        <div className="flex items-center gap-4">
          {/* Color indicator */}
          <div className={`w-1 h-14 rounded-full ${skill.color}`} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{skill.name}</h3>
              <Badge className={getRankColor(skill.rank)}>{skill.rank}</Badge>
              {skill.subSkills && skill.subSkills.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="expand-button p-1 h-6 w-6"
                  onClick={onExpandClick}
                >
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="font-medium">{skill.hours.toLocaleString()} hours</span>
              <span>{skill.weeklyHours}h this week</span>
              <span>Last: {skill.lastSession}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress to next rank</span>
                <span>{skill.rankProgress}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getRankProgressColor(
                    skill.rank
                  )} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${skill.rankProgress}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Hours display */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{skill.hours}</div>
            <div className="text-xs text-gray-500">of 10,000</div>
          </div>
        </div>

        {skill.subSkills && skill.subSkills.length > 0 && expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sub-skills</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {skill.subSkills.map((subSkill, index) => {
                const subSkillKey = `${skill.id}-${subSkill.name}`
                const isAnimating = animatingSubSkills.has(subSkillKey)

                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg ${getRankBorderColor(
                      subSkill.rank
                    )} ${isAnimating ? "scale-[1.03] shadow-xl ring-1 ring-white/50" : ""}`}
                    onClick={(e) => onSubSkillClick(e, subSkill.name)}
                  >
                    {isAnimating && (
                      <>
                        <div className="absolute inset-0 rounded-xl">
                          <div
                            className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r ${getRankProgressColor(
                              subSkill.rank
                            )} bg-[length:400%_400%] animate-[gradient_2s_linear_infinite] opacity-70`}
                          />
                          <div className="absolute inset-[2px] bg-white rounded-xl" />
                        </div>
                      </>
                    )}

                    <div className="relative z-10 p-3 bg-gradient-to-br from-white to-gray-50 group-hover:from-gray-50 group-hover:to-gray-100 transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 text-sm mb-1">{subSkill.name}</h5>
                          <Badge className={`${getRankColor(subSkill.rank)} text-xs px-2 py-0.5`}>{subSkill.rank}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{subSkill.hours}</div>
                          <div className="text-xs text-gray-500">hours</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-gray-700">{subSkill.progress}%</span>
                        </div>
                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getRankProgressColor(
                              subSkill.rank
                            )} rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${subSkill.progress}%` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                      </div>

                      <div
                        className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${getRankProgressColor(
                          subSkill.rank
                        )} opacity-5 rounded-bl-full`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function SkillTimerCard({ skill, className = "" }: { skill: Skill; className?: string }) {
  const id = skill.id
  const subSkills = skill.subSkill
  const isParent = Boolean(subSkills && subSkills.length > 0)

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
    activateTimer(id, skill, skill.timeCount, skill.parentId ?? null)
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
    <Card
      className={`hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden ${timer?.isRunning ? "scale-[1.02] shadow-lg ring-2 ring-blue-200" : ""
        } ${className}`}
      onClick={onToggleRun}
    >
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-1 h-14 rounded-full ${timer?.isRunning ? "bg-red-500" : "bg-gray-300"}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{skill.name}</h3>
              <Badge className="bg-gray-100 text-gray-800">{rank}</Badge>
              {isParent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="expand-button p-1 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded((prev) => !prev)
                  }}
                >
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-mono">{formatTime(displayTime)}</span>
              {timer?.isRunning && <span className="text-xs text-green-600">Running</span>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress to next rank</span>
                <span>{Math.floor(clampedProgress)}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${clampedProgress}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{Math.floor(displayTime / 3600)}</div>
            <div className="text-xs text-gray-500">hours</div>
          </div>
        </div>

        {isParent && expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sub-skills</h4>
            <div className="flex flex-col gap-3">
              {subSkills?.map((sub) => (
                <SkillTimerCard key={sub.id} skill={sub} className="ml-4" />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

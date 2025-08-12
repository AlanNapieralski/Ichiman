"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Target, TrendingUp, Calendar, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { SkillCard } from "@/components/ui/skill-card"
import type { Skill } from "@/models/skill"
import InfoCard from "@/components/ui/info-card"
import SkillFilters from "@/components/ui/skill-filters"


const userStats = {
    totalHours: 0,
    activeSkills: 0,
    weeklyAverage: 0,
    longestSession: 0,
}
//
// function computeRank(totalSeconds: number): Rank {
//     const entry = rankDataArr.find(([, info]) => totalSeconds >= info.goal)
//     return entry ? entry[0] : "loading"
// }
//
// function computeRankProgress(totalSeconds: number): number {
//     const current = computeRank(totalSeconds)
//     const next = rankData[current].nextRank
//     const currentGoal = rankData[current].goal
//     if (!next) return 100
//     const nextGoal = rankData[next].goal
//     if (nextGoal === currentGoal) return 0
//     const pct = ((totalSeconds - currentGoal) / (nextGoal - currentGoal)) * 100
//     return Math.max(0, Math.min(100, pct))
// }
//
// function totalWithChildrenSeconds(skill: Skill): number {
//     const children = skill.subSkills ?? []
//     const childTotal = children.reduce((sum, c) => sum + totalWithChildrenSeconds(c), 0)
//     return skill.timeCount + childTotal
// }
// const colors = [
//     "bg-blue-500",
//     "bg-purple-500",
//     "bg-green-500",
//     "bg-orange-500",
//     "bg-pink-500",
//     "bg-cyan-500",
//     "bg-amber-500",
// ]
//
//
// function mapSkillsToDashboard(skills: Skill[]): DashboardSkill[] {
//     const roots = skills.filter((s) => !s.parentId)
//     return roots.map((s, idx) => {
//         const total = totalWithChildrenSeconds(s)
//         const rank = computeRank(total)
//         const rankProgress = computeRankProgress(total)
//         const subSkills = (s.subSkills ?? []).map((sub) => ({
//             name: sub.name,
//             hours: Math.floor(sub.timeCount / 3600),
//             rank: String(computeRank(sub.timeCount)),
//             progress: Math.floor(computeRankProgress(sub.timeCount)),
//         }))
//         return {
//             id: s.id,
//             name: s.name,
//             hours: Math.floor(total / 3600),
//             rank: String(rank).charAt(0).toUpperCase() + String(rank).slice(1),
//             rankProgress: Math.floor(rankProgress),
//             weeklyHours: 0,
//             lastSession: "N/A",
//             color: colors[idx % colors.length],
//             subSkills,
//         }
//     })
// }
//


export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("")
    const [rankFilter, setRankFilter] = useState("all")
    const [sortBy, setSortBy] = useState("hours")
    const [apiSkills, setApiSkills] = useState<Skill[]>([])

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const res = await fetch("/api/main-skills", { cache: "no-store" })
                const data = await res.json()
                if (!cancelled) setApiSkills(Array.isArray(data) ? data : [])
            } catch {
                if (!cancelled) setApiSkills([])
            }
        }
        load()
        return () => { cancelled = true }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-gray-600 mt-1">Your journey of meaningful progress continues</p>
                    </div>
                    <Button className="w-fit">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Skill
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCard title="Total Hours" Icon={Clock} data={userStats.totalHours} />
                    <InfoCard title="Active Skills" Icon={Target} data={userStats.activeSkills} />
                    <InfoCard title="Weekly Avg" Icon={TrendingUp} data={userStats.weeklyAverage} />
                    <InfoCard title="Longest Session" Icon={Calendar} data={userStats.longestSession} />
                </div>

                {/* Skills Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Your Skills</h2>
                        <p className="text-sm text-gray-600">Progress without pressure</p>
                    </div>

                    <SkillFilters
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        rankFilter={rankFilter}
                        onRankFilterChange={setRankFilter}
                        sortBy={sortBy}
                        onSortByChange={setSortBy}
                    />

                    <div className="space-y-3">
                        {apiSkills.map(skill => {
                            return <SkillCard key={skill.id} skill={skill} />
                        })
                        }
                    </div>
                </div>

                {/* Motivational Footer */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
                    <CardContent className="p-6 text-center">
                        <h3 className="font-semibold text-gray-900 mb-2">Sustainable Progress</h3>
                        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                            Every hour you invest is meaningful. There&apos;s no pressure to show up daily—just consistent, intentional
                            practice that builds real expertise over time.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </div>
    )
}

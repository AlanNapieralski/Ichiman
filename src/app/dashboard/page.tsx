"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Target, TrendingUp, Calendar, Plus, Filter, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SkillCard, type DashboardSkill } from "@/components/ui/skill-card"
import type { Skill } from "@/models/skill"
import { rankData, rankDataArr, type Rank } from "@/models/RankToProgressMap"


const userStats = {
    totalHours: 0,
    activeSkills: 0,
    weeklyAverage: 0,
    longestSession: 0,
}

function computeRank(totalSeconds: number): Rank {
    const entry = rankDataArr.find(([, info]) => totalSeconds >= info.goal)
    return entry ? entry[0] : "loading"
}

function computeRankProgress(totalSeconds: number): number {
    const current = computeRank(totalSeconds)
    const next = rankData[current].nextRank
    const currentGoal = rankData[current].goal
    if (!next) return 100
    const nextGoal = rankData[next].goal
    if (nextGoal === currentGoal) return 0
    const pct = ((totalSeconds - currentGoal) / (nextGoal - currentGoal)) * 100
    return Math.max(0, Math.min(100, pct))
}

function totalWithChildrenSeconds(skill: Skill): number {
    const children = skill.subSkill ?? []
    const childTotal = children.reduce((sum, c) => sum + totalWithChildrenSeconds(c), 0)
    return skill.timeCount + childTotal
}

const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-amber-500",
]

function mapSkillsToDashboard(skills: Skill[]): DashboardSkill[] {
    const roots = skills.filter((s) => !s.parentId)
    return roots.map((s, idx) => {
        const total = totalWithChildrenSeconds(s)
        const rank = computeRank(total)
        const rankProgress = computeRankProgress(total)
        const subSkills = (s.subSkill ?? []).map((sub) => ({
            name: sub.name,
            hours: Math.floor(sub.timeCount / 3600),
            rank: String(computeRank(sub.timeCount)),
            progress: Math.floor(computeRankProgress(sub.timeCount)),
        }))
        return {
            id: s.id,
            name: s.name,
            hours: Math.floor(total / 3600),
            rank: String(rank).charAt(0).toUpperCase() + String(rank).slice(1),
            rankProgress: Math.floor(rankProgress),
            weeklyHours: 0,
            lastSession: "N/A",
            color: colors[idx % colors.length],
            subSkills,
        }
    })
}

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

    const skillsFromApi: DashboardSkill[] = useMemo(() => mapSkillsToDashboard(apiSkills), [apiSkills])

    const filteredAndSortedSkills = skillsFromApi
        .filter((skill) => {
            const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRank = rankFilter === "all" || skill.rank.toLowerCase() === rankFilter.toLowerCase()
            return matchesSearch && matchesRank
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "hours":
                    return b.hours - a.hours
                case "name":
                    return a.name.localeCompare(b.name)
                case "progress":
                    return b.rankProgress - a.rankProgress
                case "recent":
                    const sessionOrder = { Yesterday: 1, "2 days ago": 2, "3 days ago": 3, "4 days ago": 4, "1 week ago": 7 }
                    return (
                        (sessionOrder[a.lastSession as keyof typeof sessionOrder] || 999) -
                        (sessionOrder[b.lastSession as keyof typeof sessionOrder] || 999)
                    )
                default:
                    return 0
            }
        })

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
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-600">Total Hours</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.totalHours.toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-600">Active Skills</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.activeSkills}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-500" />
                                <span className="text-sm text-gray-600">Weekly Avg</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.weeklyAverage}h</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <span className="text-sm text-gray-600">Longest Session</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.longestSession}h</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Skills Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Your Skills</h2>
                        <p className="text-sm text-gray-600">Progress without pressure</p>
                    </div>

                    <Card className="mb-4">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search skills..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={rankFilter} onValueChange={setRankFilter}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Filter by rank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Ranks</SelectItem>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                        <SelectItem value="expert">Expert</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hours">Most Hours</SelectItem>
                                        <SelectItem value="name">Name A-Z</SelectItem>
                                        <SelectItem value="progress">Progress</SelectItem>
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        {filteredAndSortedSkills.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-gray-500">No skills match your current filters.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-2 bg-transparent"
                                        onClick={() => {
                                            setSearchTerm("")
                                            setRankFilter("all")
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredAndSortedSkills.map((skill) => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))
                        )}
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

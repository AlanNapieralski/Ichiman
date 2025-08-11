"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Target, TrendingUp, Award, Flame } from "lucide-react"
import Link from "next/link"

// Mock data - in real app this would come from API/database
const skillsData = {
    javascript: {
        name: "JavaScript",
        rank: "Advanced",
        hours: 847,
        totalHours: 10000,
        weeklyHours: 12,
        description: "Modern JavaScript development including ES6+, async programming, and frameworks.",
        milestones: [
            { name: "Basic Syntax", completed: true, hours: 50 },
            { name: "DOM Manipulation", completed: true, hours: 100 },
            { name: "Async Programming", completed: true, hours: 150 },
            { name: "Frameworks & Libraries", completed: false, hours: 200 },
            { name: "Advanced Patterns", completed: false, hours: 300 },
        ],
        subSkills: [
            { name: "React", rank: "Advanced", hours: 234, progress: 78 },
            { name: "Node.js", rank: "Intermediate", hours: 156, progress: 52 },
            { name: "TypeScript", rank: "Intermediate", hours: 123, progress: 41 },
        ],
    },
    design: {
        name: "UI/UX Design",
        rank: "Intermediate",
        hours: 432,
        totalHours: 10000,
        weeklyHours: 8,
        description: "User interface and experience design with focus on modern web applications.",
        milestones: [
            { name: "Design Principles", completed: true, hours: 40 },
            { name: "Wireframing", completed: true, hours: 60 },
            { name: "Prototyping", completed: false, hours: 80 },
            { name: "User Research", completed: false, hours: 100 },
            { name: "Advanced Design Systems", completed: false, hours: 150 },
        ],
        subSkills: [
            { name: "Figma", rank: "Advanced", hours: 187, progress: 62 },
            { name: "User Research", rank: "Beginner", hours: 89, progress: 30 },
            { name: "Prototyping", rank: "Intermediate", hours: 156, progress: 52 },
        ],
    },
}

const getRankColor = (rank: string) => {
    switch (rank) {
        case "Beginner":
            return {
                bg: "from-emerald-500/20 to-green-500/20",
                border: "border-emerald-500/30",
                text: "text-emerald-600",
                progress: "from-emerald-400 to-green-500",
            }
        case "Intermediate":
            return {
                bg: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/30",
                text: "text-blue-600",
                progress: "from-blue-400 to-cyan-500",
            }
        case "Advanced":
            return {
                bg: "from-purple-500/20 to-violet-500/20",
                border: "border-purple-500/30",
                text: "text-purple-600",
                progress: "from-purple-400 to-violet-500",
            }
        case "Expert":
            return {
                bg: "from-orange-500/20 to-red-500/20",
                border: "border-orange-500/30",
                text: "text-orange-600",
                progress: "from-orange-400 to-red-500",
            }
        default:
            return {
                bg: "from-gray-500/20 to-slate-500/20",
                border: "border-gray-500/30",
                text: "text-gray-600",
                progress: "from-gray-400 to-slate-500",
            }
    }
}

// Generate heatmap data
const generateHeatmapData = (period: "month" | "year") => {
    const data = []
    const days = period === "month" ? 30 : 365
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const activity = Math.random() * 8 // 0-8 hours of activity
        data.push({
            date: date.toISOString().split("T")[0],
            hours: Math.round(activity * 10) / 10,
            intensity: Math.min(Math.floor(activity / 2), 4), // 0-4 intensity levels
        })
    }
    return data
}

type PageProps = { params: Promise<{ skillId: string }> }

export default function SkillPage({ params }: PageProps) {
    const [heatmapPeriod, setHeatmapPeriod] = useState<"month" | "year">("month")
    const [heatmapData] = useState(() => ({
        month: generateHeatmapData("month"),
        year: generateHeatmapData("year"),
    }))

    // Note: In this project, Next types PageProps.params as a Promise.
    // For this test page, we tolerate both promise and plain object at runtime.
    const p: unknown = params as unknown
    const skillId = (p && typeof p === 'object' && 'then' in (p as { then?: unknown }))
        ? undefined
        : (p as { skillId?: string }).skillId
    const key = (skillId ?? 'javascript').toLowerCase() as keyof typeof skillsData
    const skill = skillsData[key]

    if (!skill) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="p-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Skill Not Found</h1>
                        <Link href="/">
                            <Button>Back to Dashboard</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        )
    }

    const rankColors = getRankColor(skill.rank)
    const progressPercentage = (skill.hours / skill.totalHours) * 100
    const currentData = heatmapData[heatmapPeriod]

    const getIntensityColor = (intensity: number) => {
        const colors = [
            "bg-gray-100", // 0 - no activity
            "bg-emerald-200", // 1 - light activity
            "bg-emerald-400", // 2 - moderate activity
            "bg-emerald-600", // 3 - high activity
            "bg-emerald-800", // 4 - very high activity
        ]
        return colors[intensity] || colors[0]
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Main Skill Info */}
                <Card className={`bg-gradient-to-r ${rankColors.bg} ${rankColors.border} border-2 shadow-lg`}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900">{skill.name}</CardTitle>
                                <Badge className={`${rankColors.text} bg-white/80 mt-2`}>{skill.rank}</Badge>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-gray-900">{skill.hours.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">of 10,000 hours</div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700">{skill.description}</p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress to Mastery</span>
                                <span>{progressPercentage.toFixed(1)}%</span>
                            </div>
                            <div className="relative h-3 bg-white/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${rankColors.progress} rounded-full transition-all duration-500 relative`}
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="text-center">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                <div className="font-semibold">{skill.weeklyHours}h</div>
                                <div className="text-xs text-gray-600">This Week</div>
                            </div>
                            <div className="text-center">
                                <Target className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                <div className="font-semibold">{(10000 - skill.hours).toLocaleString()}h</div>
                                <div className="text-xs text-gray-600">Remaining</div>
                            </div>
                            <div className="text-center">
                                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                <div className="font-semibold">{Math.round((10000 - skill.hours) / (skill.weeklyHours || 1))}</div>
                                <div className="text-xs text-gray-600">Weeks Left</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Heatmap */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Flame className="w-5 h-5" />
                                Activity Heatmap
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant={heatmapPeriod === "month" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setHeatmapPeriod("month")}
                                >
                                    Month
                                </Button>
                                <Button
                                    variant={heatmapPeriod === "year" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setHeatmapPeriod("year")}
                                >
                                    Year
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`grid gap-1 ${heatmapPeriod === "month" ? "grid-cols-10" : "grid-cols-26"}`}>
                            {currentData.map((day, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-sm ${getIntensityColor(day.intensity)} border border-gray-200 hover:scale-110 transition-transform cursor-pointer`}
                                    title={`${day.date}: ${day.hours}h`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                            <span>Less active</span>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map((intensity) => (
                                    <div
                                        key={intensity}
                                        className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)} border border-gray-200`}
                                    />
                                ))}
                            </div>
                            <span>More active</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Milestones */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Milestones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {skill.milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 ${milestone.completed ? "bg-green-500 border-green-500" : "border-gray-300"}`}
                                    >
                                        {milestone.completed && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-medium ${milestone.completed ? "text-gray-900" : "text-gray-600"}`}>
                                            {milestone.name}
                                        </div>
                                        <div className="text-sm text-gray-500">{milestone.hours}h target</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Sub-skills */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Sub-skills</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {skill.subSkills.map((subSkill, index) => {
                                const subRankColors = getRankColor(subSkill.rank)
                                return (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg bg-gradient-to-r ${subRankColors.bg} ${subRankColors.border} border`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <div className="font-medium text-gray-900">{subSkill.name}</div>
                                                <Badge className={`${subRankColors.text} bg-white/80 text-xs`}>{subSkill.rank}</Badge>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">{subSkill.hours}h</div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>Progress</span>
                                                <span>{subSkill.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${subRankColors.progress} rounded-full transition-all duration-500`}
                                                    style={{ width: `${subSkill.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

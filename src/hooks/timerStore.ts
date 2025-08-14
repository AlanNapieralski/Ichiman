import { Skill } from '@/models/skill'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Timer = {
    id: number
    skill: Skill
    time: number
    isRunning: boolean
    lastSession: number
    lastStartedAt: number | null
    parentId: number | null
    isBlocked?: boolean
}

interface TimerStore {
    timers: Record<number, Timer>
    activateTimer: (id: number, skill: Skill, initTime: number, parentId: number | null) => void
    startTimer: (id: number) => void
    stopTimer: (id: number) => void
    getTime: (id: number) => number
    getChildTime: (id: number) => number
    tick: () => void
    syncTimersWithSkills: (skills: Skill[]) => void
}

export const useTimerStore = create<TimerStore>()(
    persist(
        (set, get) => ({
            timers: {},
            activateTimer: (id, skill, initTime, parentId) => {
                const timers = { ...get().timers }
                const existingTimer = timers[id]
                
                // If timer was running before reload, preserve that state
                const wasRunning = existingTimer?.isRunning ?? false
                const lastStartedAt = existingTimer?.lastStartedAt
                
                timers[id] = {
                    // Preserve all existing timer data
                    ...existingTimer,
                    // Update with new data
                    id,
                    skill,
                    time: existingTimer?.time ?? initTime, // Keep existing time or use initTime
                    isRunning: wasRunning, // Preserve running state
                    lastStartedAt: lastStartedAt, // Preserve start time if running
                    parentId,
                    // Preserve existing lastSession
                    lastSession: existingTimer?.lastSession ?? 0
                }
                
                set({ timers })
            },
            startTimer: (id) => {
                const timers = { ...get().timers }

                // check if we should start
                const parentId = timers[id].parentId
                // if is a child
                if (parentId) {
                    // if the child's parent is not running
                    if (timers[parentId]?.isRunning) {
                        get().stopTimer(parentId)
                    }
                    // if is a parent
                } else if (!parentId) {
                    const isHavingRunningChildren = Object.values(timers).some(timer => timer.parentId === id && timer.isRunning)

                    // deactivate childrem
                    if (isHavingRunningChildren) {
                        Object.values(timers).forEach(timer => {
                            if (timer.parentId === id && timer.isRunning) {
                                get().stopTimer(timer.id)
                            }
                        })
                    }

                }

                timers[id] = {
                    ...(timers[id]),
                    isRunning: true,
                    lastStartedAt: Date.now(),
                }

                set({ timers })
            },
            stopTimer: (id) => {
                const timers = { ...get().timers }
                const timer = timers[id]

                if (!timer || !timer?.isRunning)
                    return

                const now = Date.now()
                const elapsed = Math.floor((now - (timer.lastStartedAt ?? now)) / 1000)

                timer.time += elapsed
                timer.isRunning = false
                timer.lastStartedAt = null
                timer.lastSession = elapsed

                set({ timers })
            },
            getChildTime: (id) => {
                const timers = get().timers
                const childTimes = Object.values(timers)
                    .filter(t => t.skill?.parentId === id)
                    .reduce((total, child) => total + child.time, 0)

                return childTimes
            },
            tick: () => {
                // force UI update by triggering a dummy state change (if needed)
                set(state => ({ timers: { ...state.timers } }))
            },
            syncTimersWithSkills: (skills: Skill[]) => {
                const flatten = (roots: Skill[]): number[] => {
                    const ids: number[] = []
                    const stack: Skill[] = [...roots]
                    while (stack.length > 0) {
                        const s = stack.pop()!
                        ids.push(s.id)
                        if (s.subSkills && s.subSkills.length > 0) stack.push(...s.subSkills)
                    }
                    return ids
                }

                const allowedIds = new Set<number>(flatten(skills))
                const current = get().timers
                const updated: Record<number, Timer> = {}
                
                // Preserve all existing timers and update skill data
                for (const [key, timer] of Object.entries(current)) {
                    const id = Number(key)
                    if (allowedIds.has(id)) {
                        // Find the corresponding skill
                        const skill = skills.find(s => s.id === id) || 
                                    skills.flatMap(s => s.subSkills || []).find(sub => sub.id === id)
                        
                        if (skill) {
                            // Update skill data but preserve timer state
                            updated[id] = {
                                ...timer,
                                skill: skill,
                                parentId: skill.parentId || null
                            }
                        } else {
                            // Keep existing timer even if skill not found (might be a race condition)
                            updated[id] = timer
                        }
                    } else {
                        // Keep existing timer even if not in current skills (preserve state)
                        updated[id] = timer
                    }
                }
                
                set({ timers: updated })
            },
            getTime: (id: number) => get().timers[id]?.time || 0,
            setTime: (id: number, time: number) => {
                const timers = { ...get().timers }
                if (timers[id]) {
                    timers[id].time = time
                }
                set({ timers })
            }
        }),
        {
            name: 'timer-storage',
        }
    )
)

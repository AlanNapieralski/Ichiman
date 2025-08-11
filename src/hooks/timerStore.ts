import { Skill } from '@/models/skill'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Timer = {
    id: number
    skill: Skill
    time: number
    isRunning: boolean
    lastStartedAt: number | null
    parentId: number | null
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

                timers[id] = {
                    ...(timers[id] || { id, time: initTime, skill: skill, isRunning: false, lastStartedAt: null, parentId }),
                    lastStartedAt: Date.now(),
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
                        timers[parentId].isRunning = false
                    }
                    // if is a parent
                } else if (!parentId) {
                    const isHavingRunningChildren = Object.values(timers).some(timer => timer.parentId === id && timer.isRunning)

                    // deactivate childrem
                    if (isHavingRunningChildren) {
                        Object.values(timers).forEach(timer => timer.parentId === id ? timer.isRunning = false : null)
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
                        if (s.subSkill && s.subSkill.length > 0) stack.push(...s.subSkill)
                    }
                    return ids
                }

                const allowedIds = new Set<number>(flatten(skills))
                const current = get().timers
                const pruned: Record<number, Timer> = {}
                for (const [key, timer] of Object.entries(current)) {
                    const id = Number(key)
                    if (allowedIds.has(id)) {
                        pruned[id] = timer
                    }
                }
                set({ timers: pruned })
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

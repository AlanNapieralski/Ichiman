import { Skill } from '@/app/dashboard/page'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Timer = {
    id: number
    skill: Skill
    time: number
    isRunning: boolean
    lastStartedAt: number | null
    isBlocked: boolean
    parentId: number | null
}

interface TimerStore {
    timers: Record<number, Timer>
    activateTimer: (id: number, skill: Skill, initTime: number) => void
    startTimer: (id: number) => void
    stopTimer: (id: number) => void
    getTime: (id: number) => number
    getChildTime: (id: number) => number
    setParentId: (id: number, parentId: number) => void
    tick: () => void
}

export const useTimerStore = create<TimerStore>()(
    persist(
        (set, get) => ({
            timers: {},
            activateTimer: (id, skill, initTime) => {
                const timers = { ...get().timers }

                timers[id] = {
                    ...(timers[id] || { id, time: initTime, skill: skill, isRunning: false, lastStartedAt: null, parentId: null }),
                    isRunning: true,
                    lastStartedAt: Date.now(),
                    isBlocked: false
                }


                set({ timers })
            },
            startTimer: (id) => {
                const timers = { ...get().timers }

                timers[id] = {
                    ...(timers[id]),
                    isRunning: true,
                    lastStartedAt: Date.now(),
                    isBlocked: false
                }

                console.log(timers[id])
                // if is a child and running, block the parent
                const parentId = timers[id].parentId
                if (parentId) {
                    timers[parentId].isBlocked = true
                    // if is a parent and running, block every child
                } else if (!parentId) {
                    Object.values(timers).filter(timer => timer.parentId == id).forEach(child => child.isBlocked = true)
                }

                set({ timers })
            },
            stopTimer: (id) => {
                const timers = { ...get().timers }
                const timer = timers[id]

                if (!timer)
                    return

                if (timer?.isRunning) {
                    const now = Date.now()
                    const elapsed = Math.floor((now - (timer.lastStartedAt ?? now)) / 1000)
                    timer.time += elapsed
                    timer.isRunning = false
                    timer.lastStartedAt = null
                }

                // if is a child and stopped, and every child has stopped, unblock the parent
                const parentId = timers[id].parentId
                if (parentId) {
                    const children = Object.values(timers).filter(timer => timer.parentId === parentId)
                    if (children.every(child => !child.isRunning)) {
                        timers[parentId].isBlocked = false
                    }
                    // if is a parent and stopped, unblock every child
                } else if (!parentId) {
                    Object.values(timers).filter(timer => timer.parentId == id).forEach(child => child.isBlocked = false)
                }

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
            setParentId: (id: number, parentId: number) => {
                const timers = { ...get().timers };
                if (timers[id]?.skill) {
                    timers[id].skill.parentId = parentId
                }
                set({ timers });
            },
            setBlocked: (id: number, isBlocked: boolean) => {
                const timers = { ...get().timers };
                if (timers[id]) {
                    timers[id].isBlocked = isBlocked
                }
                set({ timers })
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

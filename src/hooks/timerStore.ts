import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Timer = {
    id: number
    parentId?: number
    time: number
    isRunning: boolean
    lastStartedAt: number | null
    isBlocked: boolean
}

interface TimerStore {
    timers: Record<number, Timer>
    startTimer: (id: number) => void
    stopTimer: (id: number) => void
    getTime: (id: number) => number
    getTotalTime: (id: number) => number
    setParentId: (id: number, parentId: number) => void
    tick: () => void
}

export const useTimerStore = create<TimerStore>()(
    persist(
        (set, get) => ({
            timers: {},
            startTimer: (id) => {
                const timers = { ...get().timers }
                const isChildRunning = Object.entries(timers).filter(([_, timer]) => timer.parentId === id).some(([_, timer]) => timer.isRunning)

                if (isChildRunning) {
                    timers[id] = {
                        ...(timers[id] || { id, time: 0, isRunning: false, lastStartedAt: null }),
                        isRunning: false,
                        lastStartedAt: null,
                        isBlocked: true
                    }
                } else {
                    timers[id] = {
                        ...(timers[id] || { id, time: 0, isRunning: false, lastStartedAt: null }),
                        isRunning: true,
                        lastStartedAt: Date.now(),
                        isBlocked: false
                    }

                }
                set({ timers })
            },
            stopTimer: (id) => {
                const timers = { ...get().timers }
                const timer = timers[id]
                if (timer?.isRunning) {
                    const now = Date.now()
                    const elapsed = Math.floor((now - (timer.lastStartedAt ?? now)) / 1000)
                    timer.time += elapsed
                    timer.isRunning = false
                    timer.lastStartedAt = null
                }
                if (timer.parentId) {
                    const isChildRunning = Object.entries(timers).filter(([_, orgTimer]) => orgTimer.parentId === timer.parentId).some(([_, orgTimer]) => orgTimer.isRunning)
                    if (!isChildRunning) {
                        timers[timer.parentId].isBlocked = false
                    }
                }
                set({ timers })
            },
            getTotalTime: (id) => {
                const timers = get().timers
                const parent = timers[id]
                console.log(Object.values(timers))
                const childTimes = Object.values(timers)
                    .filter(t => t.parentId === id)
                    .reduce((total, child) => {
                        console.log('child object', child)
                        return total + child.time
                    }, 0)

                const parentTime = parent
                    ? parent.time + (parent.isRunning ? Math.floor((Date.now() - (parent.lastStartedAt ?? Date.now())) / 1000) : 0)
                    : 0

                console.log('parent', parentTime)
                console.log('child', childTimes)
                return parentTime + childTimes
            },
            tick: () => {
                // force UI update by triggering a dummy state change (if needed)
                set(state => ({ timers: { ...state.timers } }))
            },
            setParentId: (id: number, parentId: number) => {
                const timers = { ...get().timers };
                if (timers[id]) {
                    timers[id].parentId = parentId; // Assign parentId
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
            getTime: (id) => get().timers[id]?.time || 0,
        }),
        {
            name: 'timer-storage',
        }
    )
)

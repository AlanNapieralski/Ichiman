import { Skill } from '@/models/skill'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Timer = {
    id: number
    skill: Skill
    isRunning: boolean
    lastSession: number
    lastStartedAt: number | null
}

interface TimerStore {
    timers: Record<number, Timer>
    startTimer: (id: number) => void
    stopTimer: (id: number) => void
    getChildTime: (id: number) => number
    tick: () => void
    syncTimersWithSkills: (skills: Skill[]) => void
    fetchSkills: () => void
}

export const useTimerStore = create<TimerStore>()(
    persist(
        (set, get) => ({
            timers: {},
            startTimer: (id) => {
                const timers = { ...get().timers }

                // extract all families
                const parents = Object.values(timers).filter(timer => !timer.skill?.parentId)

                // parents become a family
                type Family = {
                    parent: Timer;
                    children: Timer[];
                };

                const families: Family[] = parents.map(parent => {
                    // Collect all child timers
                    const childTimers = Object.values(timers).filter(timer => timer.skill?.parentId === parent.id);

                    // Return the Family object
                    return {
                        parent,
                        children: childTimers
                    };
                });

                // only one family can run at any time
                // if some family is running, stop it

                // array of familes that are running
                const familiesRunning = families.reduce((acc: Family[], family) => {
                    if (family.parent.isRunning || family.children.some(child => child.isRunning)) {
                        acc.push(family)
                    }
                    return acc
                }, []);

                const stopFamily = (family: Family): void => {
                    get().stopTimer(family.parent.id)
                    family.children.forEach(child => get().stopTimer(child.id))
                }

                const currentFamily = families.find(family => family.parent.id === id || family.children.find(child => child.id === id))
                // without stopping the current family
                const toStop = currentFamily ? familiesRunning.filter(family => family.parent.id !== currentFamily.parent.id) : familiesRunning
                toStop.forEach(family => stopFamily(family))

                // any child can run or a parent within a family
                // check within the family
                if (timers[id].skill?.parentId) {
                    if (currentFamily?.parent.isRunning) {
                        get().stopTimer(currentFamily?.parent.id)
                    }
                    // if is a parent
                } else if (!timers[id].skill?.parentId) {
                    currentFamily?.children.forEach(child => get().stopTimer(child.id))
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

                if (timer.skill) {
                    timer.skill.timeCount += elapsed
                    timer.isRunning = false
                    timer.lastStartedAt = null
                    timer.lastSession = elapsed
                }


                set({ timers })
            },
            getChildTime: (id) => {
                const timers = { ...get().timers }

                if (timers[id].skill?.parentId) {
                    return 0
                }

                const childTimes = Object.values(timers)
                    .filter(timer => timer.skill?.parentId === id)
                    .reduce((total, timer) => total += timer.skill?.timeCount, 0)


                console.log('getchildtime')
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
            fetchSkills: async () => {
                const res = await fetch('api/main-skills')
                const skills: Skill[] = await res.json()

                const timers = { ...get().timers }

                skills.forEach(skill => {

                    timers[skill.id] = {
                        id: skill.id, // skill id === timer id
                        skill,

                        lastSession: 0,
                        isRunning: false,
                        lastStartedAt: null,
                    }
                })

                set({ timers })
            },
        }),
        {
            name: 'timer-storage',
        }
    )
)

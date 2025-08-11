import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useTimerStore } from '../timerStore'
import type { Skill } from '@/models/skill'

function createSkill(partial: Partial<Skill> = {}): Skill {
  return {
    id: partial.id ?? 1,
    name: partial.name ?? 'Skill',
    timeCount: partial.timeCount ?? 0,
    userId: partial.userId ?? 1,
    parentId: partial.parentId,
    subSkill: partial.subSkill,
  }
}

describe('useTimerStore', () => {
  beforeEach(() => {
    // reset store between tests
    const { getState, setState } = useTimerStore
    const timers = {}
    act(() => setState({ ...getState(), timers }))
  })

  it('activates a timer with initial time and not blocked', () => {
    const skill = createSkill({ id: 10 })
    act(() => useTimerStore.getState().activateTimer(10, skill, 5))
    const t = useTimerStore.getState().timers[10]
    expect(t).toBeTruthy()
    expect(t.time).toBe(5)
    expect(t.isRunning).toBe(true)
    expect(t.isBlocked).toBe(false)
  })

  it('startTimer blocks siblings appropriately: parent blocks children', () => {
    const parent = createSkill({ id: 1 })
    const childA = createSkill({ id: 2, parentId: 1 })
    const childB = createSkill({ id: 3, parentId: 1 })

    act(() => {
      const s = useTimerStore.getState()
      s.activateTimer(1, parent, 0)
      s.activateTimer(2, childA, 0)
      s.setParentId(2, 1)
      s.activateTimer(3, childB, 0)
      s.setParentId(3, 1)
    })

    act(() => useTimerStore.getState().startTimer(1))

    const state = useTimerStore.getState()
    expect(state.timers[2].isBlocked).toBe(true)
    expect(state.timers[3].isBlocked).toBe(true)
  })

  it('startTimer blocks parent when child starts', () => {
    const parent = createSkill({ id: 1 })
    const child = createSkill({ id: 2, parentId: 1 })

    act(() => {
      const s = useTimerStore.getState()
      s.activateTimer(1, parent, 0)
      s.activateTimer(2, child, 0)
      s.setParentId(2, 1)
    })

    act(() => useTimerStore.getState().startTimer(2))

    const state = useTimerStore.getState()
    expect(state.timers[1].isBlocked).toBe(true)
  })

  it('stopTimer unblocks children when parent stops', () => {
    const parent = createSkill({ id: 1 })
    const child = createSkill({ id: 2, parentId: 1 })

    act(() => {
      const s = useTimerStore.getState()
      s.activateTimer(1, parent, 0)
      s.activateTimer(2, child, 0)
      s.setParentId(2, 1)
      s.startTimer(1)
    })

    act(() => useTimerStore.getState().stopTimer(1))

    const state = useTimerStore.getState()
    expect(state.timers[2].isBlocked).toBe(false)
  })

  it('parent remains blocked while child timer is running, unblocks when all children stop', () => {
    const parent = createSkill({ id: 1 })
    const childA = createSkill({ id: 2, parentId: 1 })
    const childB = createSkill({ id: 3, parentId: 1 })

    act(() => {
      const s = useTimerStore.getState()
      s.activateTimer(1, parent, 0)
      s.activateTimer(2, childA, 0)
      s.setParentId(2, 1)
      s.activateTimer(3, childB, 0)
      s.setParentId(3, 1)
    })

    act(() => useTimerStore.getState().startTimer(2))
    expect(useTimerStore.getState().timers[1].isBlocked).toBe(true)

    act(() => useTimerStore.getState().stopTimer(2))

    // Parent should remain blocked because childB is not stopped
    expect(useTimerStore.getState().timers[1].isBlocked).toBe(true)
    act(() => useTimerStore.getState().startTimer(3))

    act(() => useTimerStore.getState().stopTimer(3))

    // Parent should unblock because all children have stopped
    expect(useTimerStore.getState().timers[1].isBlocked).toBe(false)
  })
})

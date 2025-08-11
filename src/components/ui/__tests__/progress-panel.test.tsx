import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProgressPanel from '../progress-panel'
import { useTimerStore } from '@/hooks/timerStore'
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

describe('ProgressPanel', () => {
  beforeEach(() => {
    const { getState, setState } = useTimerStore
    const timers = {}
    setState({ ...getState(), timers })
  })

  it('renders skill name and initial time', () => {
    const skill = createSkill({ name: 'Guitar', timeCount: 0 })
    render(<ProgressPanel skill={skill} />)

    expect(screen.getByText('Guitar')).toBeInTheDocument()
    expect(screen.getByText(/00:00 min/)).toBeInTheDocument()
  })

  it('blocks children when parent toggled active', async () => {
    const user = userEvent.setup()

    const childSkill: Skill = createSkill({ id: 2, name: 'Chord Practice', parentId: 1 })
    const parentSkill: Skill = {
      id: 1,
      name: 'Guitar',
      timeCount: 0,
      userId: 1,
      subSkill: [childSkill],
    }

    render(<ProgressPanel skill={parentSkill} />)

    // Click parent panel to start
    const buttons = screen.getAllByRole('button')
    const parentButton = buttons[0]
    await user.click(parentButton)

    // After parent starts, child panel should render and be disabled
    await waitFor(() => {
      const childButton = screen.getByRole('button', { name: /Chord Practice/i })
      expect(childButton).toBeDisabled()
    })
  })
})

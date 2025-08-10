"use client"

import { useTimerStore } from "@/hooks/timerStore"
import type { Skill } from "@/models/skill"
import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"
import { useEffect } from "react"

type SkillActionsProps = {
  skill: Skill
}

export default function SkillActions({ skill }: SkillActionsProps) {
  const { activateTimer, startTimer, stopTimer } = useTimerStore()
  const timer = useTimerStore((state) => state.timers[skill.id])

  useEffect(() => {
    if (!timer) {
      activateTimer(skill.id, skill, skill.timeCount)
      stopTimer(skill.id) // initialize but not running by default here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isRunning = !!timer?.isRunning

  return (
    <div className="flex items-center gap-3">
      {!isRunning ? (
        <Button onClick={() => startTimer(skill.id)} className="gap-2">
          <Play className="h-4 w-4" /> Start session
        </Button>
      ) : (
        <Button onClick={() => stopTimer(skill.id)} variant="destructive" className="gap-2">
          <Square className="h-4 w-4" /> Stop session
        </Button>
      )}
    </div>
  )
}




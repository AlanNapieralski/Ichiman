"use client"

import React from "react"

type SkillProgressBarProps = {
  value: number
  gradientClassName?: string
  heightClassName?: string
  className?: string
}

/**
 * Gradient progress bar used by skill timer cards.
 * Clamps value to [0, 100].
 */
export default function SkillProgressBar({
  value,
  gradientClassName = "from-blue-400 to-blue-600",
  heightClassName = "h-2",
  className = "",
}: SkillProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`relative ${heightClassName} bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${gradientClassName} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

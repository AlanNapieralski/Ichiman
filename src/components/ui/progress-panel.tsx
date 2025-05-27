type ProgressTier = keyof typeof progressFillClassMap;
interface ProgressPanelProps {
  text: string
  progress: number // 0-100
  progressFill: ProgressTier
  timeSpent?: string
  className?: string
}

export const progressFillClassMap = {
  bronze: 'bg-amber-700 group-hover:bg-amber-800 group-active:bg-amber-800',
  silver: 'bg-gray-400 group-hover:bg-gray-600 group-active:bg-gray-600',
  gold: 'bg-yellow-300 group-hover:bg-yellow-500 group-active:bg-yellow-500',
  platinum: 'bg-blue-300 group-hover:bg-blue-500 group-active:bg-blue-500',
  diamond: 'bg-purple-300 group-hover:bg-purple-400 group-active:bg-purple-400',
  master: 'bg-purple-700 group-hover:bg-purple-900 group-active:bg-purple-900',
} as const;


export default function ProgressPanel({ text, progress, progressFill, timeSpent, className = "" }: ProgressPanelProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main panel container */}
      <button className="group relative h-32 w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl border border-gray-200 hover:border-gray-300 active:border-gray-400 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md active:shadow-lg active:scale-[0.98] transform">
        {/* Progress fill */}
        <div
          className={`absolute top-0 left-0 h-full ${progressFillClassMap[progressFill]}  transition-all duration-300 ease-in-out rounded-xl`}
          style={{ width: `${clampedProgress}%` }}
        />

        {/* Text content */}
        <div className="relative z-10 flex items-center justify-between h-full px-4">
          <span className="font-bold text-2xl text-gray-800 group-hover:text-gray-900 group-active:text-black transition-colors duration-300">
            {text}
          </span>
          {timeSpent && (
            <span className="text-lg text-gray-600 group-hover:text-gray-700 group-active:text-gray-800 font-mono transition-colors duration-300">
              {timeSpent}
            </span>
          )}
        </div>
      </button>

      {/* Progress percentage indicator */}
      <div className="mb-4 text-center">
        <span className="text-sm text-gray-500">{clampedProgress.toFixed(0)}% complete</span>
      </div>
    </div>
  )
}

import { useState, useRef, useCallback } from 'react'

const LONG_PRESS_MS = 1500

/**
 * ResetButton — Requires a 1.5 s long-press to reset all votes.
 * Shows a circular progress ring while holding.
 */
export default function ResetButton({ onReset }) {
  const [progress, setProgress] = useState(0)
  const [resetting, setResetting] = useState(false)
  const timerRef = useRef(null)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  const tick = useCallback(() => {
    const elapsed = Date.now() - startRef.current
    const pct = Math.min(elapsed / LONG_PRESS_MS, 1)
    setProgress(pct)

    if (pct >= 1) {
      // trigger
      cancelAnimationFrame(rafRef.current)
      setResetting(true)
      onReset().finally(() => {
        setResetting(false)
        setProgress(0)
      })
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [onReset])

  const handleStart = useCallback(() => {
    startRef.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const handleEnd = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setProgress(0)
  }, [])

  const circumference = 2 * Math.PI * 18

  return (
    <button
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      disabled={resetting}
      className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg
                 bg-[#2a1f10] hover:bg-[#3d2b1f] border border-[#5a3e2a]/50
                 text-[#c8a96e] text-sm font-typewriter
                 transition-colors cursor-pointer select-none
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Progress ring */}
      {progress > 0 && (
        <svg className="absolute -left-1 -top-1 w-12 h-12" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="#c0392b"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
            className="transition-none"
          />
        </svg>
      )}

      <span className="text-base">🔥</span>
      <span>{resetting ? 'Carmen está borrando pruebas…' : 'Mantener para nueva ronda'}</span>
    </button>
  )
}

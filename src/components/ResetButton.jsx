import { useState, useRef, useCallback } from 'react'

const LONG_PRESS_MS = 1500

/**
 * ResetButton — Hold 1.5s to reset. Dramatic fire animation while holding.
 */
export default function ResetButton({ onReset }) {
  const [progress, setProgress] = useState(0)
  const [resetting, setResetting] = useState(false)
  const [exploding, setExploding] = useState(false)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  const tick = useCallback(() => {
    const elapsed = Date.now() - startRef.current
    const pct = Math.min(elapsed / LONG_PRESS_MS, 1)
    setProgress(pct)

    if (pct >= 1) {
      cancelAnimationFrame(rafRef.current)
      setExploding(true)
      // Vibrate on mobile if available
      navigator.vibrate?.(200)
      setTimeout(() => {
        setResetting(true)
        onReset().finally(() => {
          setResetting(false)
          setProgress(0)
          setExploding(false)
        })
      }, 400)
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
    if (progress < 1) setProgress(0)
  }, [progress])

  // Dynamic styles based on progress
  const isHolding = progress > 0
  const intensity = Math.min(progress * 1.5, 1) // ramps up faster
  const bgColor = isHolding
    ? `rgba(${Math.round(192 * intensity)}, ${Math.round(57 * (1 - intensity * 0.5))}, ${Math.round(43 * (1 - intensity * 0.3))}, ${0.2 + intensity * 0.6})`
    : undefined
  const shake = isHolding ? `translate(${Math.random() * progress * 3 - 1.5}px, ${Math.random() * progress * 2 - 1}px)` : undefined

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        disabled={resetting}
        style={{
          backgroundColor: bgColor,
          transform: exploding ? 'scale(1.1)' : shake,
        }}
        className={`
          relative overflow-hidden flex items-center justify-center gap-3
          px-6 py-3.5 rounded-lg
          bg-[#2a1f10] hover:bg-[#3d2b1f]
          border-2 transition-colors cursor-pointer select-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isHolding
            ? 'border-[#c0392b] shadow-[0_0_20px_rgba(192,57,43,0.4)]'
            : 'border-[#5a3e2a]/50'
          }
          ${exploding ? 'animate-vote-pop' : ''}
        `}
      >
        {/* Progress bar underneath */}
        {isHolding && (
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#c0392b]/30 via-[#e74c3c]/40 to-[#f39c12]/50 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        )}

        {/* Animated fire particles */}
        {isHolding && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute text-xs animate-bounce"
                style={{
                  left: `${15 + i * 14}%`,
                  bottom: `${progress * 60 + Math.sin(Date.now() / 200 + i) * 10}%`,
                  opacity: progress * 0.8,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.3 + Math.random() * 0.3}s`,
                }}
              >
                🔥
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2 font-typewriter text-sm">
          <span className={`text-lg transition-transform duration-300 ${isHolding ? 'scale-125' : ''}`}>
            {exploding ? '💥' : resetting ? '⏳' : '🔥'}
          </span>
          <span className={isHolding ? 'text-[#f5e6c8] font-bold' : 'text-[#c8a96e]'}>
            {exploding
              ? '¡¡BOOM!!'
              : resetting
                ? 'Carmen está borrando pruebas…'
                : isHolding
                  ? `Destruyendo evidencia… ${Math.round(progress * 100)}%`
                  : 'Mantener para nueva ronda'
            }
          </span>
        </span>
      </button>

      {/* Subtle hint text */}
      {!isHolding && !resetting && (
        <p className="font-typewriter text-[10px] text-[#3d2b1f]">
          🤫 Mantén pulsado 1.5s para destruir las pruebas
        </p>
      )}
    </div>
  )
}

import { useState, useCallback, useEffect } from 'react'

/**
 * VoteButtons — Two big YES / NO buttons.
 * Handles localStorage check & visual lock after voting.
 * Unlocks on:
 *   1. resetSignal prop (from broadcast/realtime)
 *   2. storage event (cross-tab in same browser)
 *   3. periodic check every 2s (bulletproof fallback)
 */
export default function VoteButtons({ roomId, onVote, resetSignal }) {
  const hasVotedKey = `voted_${roomId}`
  const [hasVoted, setHasVoted] = useState(() =>
    localStorage.getItem(hasVotedKey) !== null
  )
  const [votedChoice, setVotedChoice] = useState(() =>
    localStorage.getItem(hasVotedKey)
  )
  const [animating, setAnimating] = useState(false)

  // ── 1. Listen for reset signal (from broadcast/realtime) ──
  useEffect(() => {
    if (resetSignal === 0) return
    localStorage.removeItem(hasVotedKey)
    setHasVoted(false)
    setVotedChoice(null)
  }, [resetSignal, hasVotedKey])

  // ── 2. Listen for storage event (cross-tab same browser) ──
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === hasVotedKey && e.newValue === null) {
        setHasVoted(false)
        setVotedChoice(null)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [hasVotedKey])

  // ── 3. Periodic check — if localStorage was cleared, unlock ──
  useEffect(() => {
    if (!hasVoted) return
    const interval = setInterval(() => {
      if (localStorage.getItem(hasVotedKey) === null) {
        setHasVoted(false)
        setVotedChoice(null)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [hasVoted, hasVotedKey])

  const handleVote = useCallback(
    async (choice) => {
      if (hasVoted) return

      setAnimating(true)
      try {
        await onVote(choice)
        localStorage.setItem(hasVotedKey, choice ? 'yes' : 'no')
        setVotedChoice(choice ? 'yes' : 'no')
        setHasVoted(true)
      } catch {
        /* error already logged in hook */
      } finally {
        setTimeout(() => setAnimating(false), 500)
      }
    },
    [hasVoted, hasVotedKey, onVote]
  )

  // After voting: success state
  if (hasVoted) {
    return (
      <div className="flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              className="animate-check"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              style={{ strokeDasharray: 50, strokeDashoffset: 50 }}
            />
          </svg>
        </div>

        <p className="text-xl text-slate-300 font-medium">
          Votaste{' '}
          <span
            className={
              votedChoice === 'yes'
                ? 'text-emerald-400 font-bold'
                : 'text-rose-400 font-bold'
            }
          >
            {votedChoice === 'yes' ? 'SÍ ✓' : 'NO ✗'}
          </span>
        </p>
        <p className="text-sm text-slate-500">
          Tu voto ha sido registrado de forma anónima
        </p>
      </div>
    )
  }

  // Voting state
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg text-slate-400 font-medium tracking-wide">
        Elige tu voto
      </p>

      <div className="flex gap-6 w-full max-w-md">
        {/* YES */}
        <button
          onClick={() => handleVote(true)}
          disabled={animating}
          className={`
            flex-1 py-8 rounded-2xl text-3xl font-black
            bg-emerald-600 hover:bg-emerald-500 active:scale-95
            border-2 border-emerald-400/30
            shadow-lg shadow-emerald-900/40
            transition-all duration-200 cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            ${animating ? 'animate-vote-pop' : ''}
          `}
        >
          👍 SÍ
        </button>

        {/* NO */}
        <button
          onClick={() => handleVote(false)}
          disabled={animating}
          className={`
            flex-1 py-8 rounded-2xl text-3xl font-black
            bg-rose-600 hover:bg-rose-500 active:scale-95
            border-2 border-rose-400/30
            shadow-lg shadow-rose-900/40
            transition-all duration-200 cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            ${animating ? 'animate-vote-pop' : ''}
          `}
        >
          👎 NO
        </button>
      </div>
    </div>
  )
}

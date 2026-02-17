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

  // After voting: stamp effect
  if (hasVoted) {
    return (
      <div className="flex flex-col items-center gap-5 animate-fade-in-up">
        {/* Stamp effect */}
        <div className="animate-stamp">
          <div className={`
            w-28 h-28 rounded-full border-4 flex items-center justify-center
            font-oswald text-2xl font-bold uppercase
            ${votedChoice === 'yes'
              ? 'border-[#27ae60] text-[#27ae60] shadow-[0_0_20px_rgba(39,174,96,0.3)]'
              : 'border-[#c0392b] text-[#c0392b] shadow-[0_0_20px_rgba(192,57,43,0.3)]'
            }
          `}>
            {votedChoice === 'yes' ? 'JA!' : 'NEIN!'}
          </div>
        </div>

        <p className="font-oswald text-xl text-[#f5e6c8] uppercase tracking-wide">
          Has votado{' '}
          <span className={votedChoice === 'yes' ? 'text-[#27ae60]' : 'text-[#c0392b]'}>
            {votedChoice === 'yes' ? 'JA! ✓' : 'NEIN! ✗'}
          </span>
        </p>
        <p className="font-typewriter text-xs text-[#5a3e2a] text-center">
          📨 Sobre sellado y entregado a Carmen · Voto anónimo
        </p>
      </div>
    )
  }

  // Voting state
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="font-typewriter text-[#c8a96e] text-sm tracking-wide">
        🗳️ La Presidenta Carmen exige tu voto
      </p>

      <div className="flex gap-5 w-full max-w-md">
        {/* JA! */}
        <button
          onClick={() => handleVote(true)}
          disabled={animating}
          className={`
            flex-1 py-8 rounded-lg text-3xl font-oswald font-bold uppercase
            bg-[#1a472a] hover:bg-[#27ae60] active:scale-95
            border-2 border-[#27ae60]/50
            shadow-lg shadow-[#1a472a]/60
            text-[#f5e6c8] hover:text-white
            transition-all duration-200 cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            ${animating ? 'animate-vote-pop' : ''}
          `}
        >
          🕊️ JA!
        </button>

        {/* NEIN! */}
        <button
          onClick={() => handleVote(false)}
          disabled={animating}
          className={`
            flex-1 py-8 rounded-lg text-3xl font-oswald font-bold uppercase
            bg-[#4a1a1a] hover:bg-[#c0392b] active:scale-95
            border-2 border-[#c0392b]/50
            shadow-lg shadow-[#4a1a1a]/60
            text-[#f5e6c8] hover:text-white
            transition-all duration-200 cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            ${animating ? 'animate-vote-pop' : ''}
          `}
        >
          💀 NEIN!
        </button>
      </div>

      <p className="font-typewriter text-[10px] text-[#3d2b1f] text-center">
        ⚠️ Carmen sabrá si no votas. Carmen siempre sabe.
      </p>
    </div>
  )
}

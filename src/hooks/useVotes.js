import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

const POLL_INTERVAL = 3000 // fallback polling every 3s

/**
 * Manages vote state for a room:
 *  - Fetches counts from DB
 *  - Postgres Changes (realtime DB events) as primary sync
 *  - Broadcast channel for instant cross-device signals
 *  - Polling every 3s as bulletproof fallback
 *  - Exposes castVote, resetVotes, counts, loading, resetSignal
 */
export function useVotes(roomId) {
  const [counts, setCounts] = useState({ yes: 0, no: 0 })
  const [loading, setLoading] = useState(true)
  const [resetSignal, setResetSignal] = useState(0)
  const channelRef = useRef(null)
  const pollRef = useRef(null)

  // ── Fetch counts from DB ──────────────────────────────
  const fetchCounts = useCallback(async () => {
    const { data, error } = await supabase
      .from('votes')
      .select('choice')
      .eq('room_id', roomId)

    if (error) {
      console.error('Error fetching votes:', error)
      return
    }

    const yes = data.filter((v) => v.choice === true).length
    const no = data.filter((v) => v.choice === false).length
    setCounts({ yes, no })
    setLoading(false)

    // Detect remote reset: user voted but DB has 0 votes → someone reset
    const hasVotedLocally = localStorage.getItem(`voted_${roomId}`)
    if (hasVotedLocally && yes === 0 && no === 0) {
      localStorage.removeItem(`voted_${roomId}`)
      setResetSignal((s) => s + 1)
    }
  }, [roomId])

  // ── Subscribe: Postgres Changes + Broadcast + Polling ─
  useEffect(() => {
    fetchCounts()

    // 1️⃣  Postgres Changes — fires on INSERT/DELETE in the DB
    const dbChannel = supabase
      .channel(`db:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchCounts()
        }
      )
      .subscribe()

    // 2️⃣  Broadcast — instant cross-device signaling
    const broadcastChannel = supabase.channel(`bcast:${roomId}`)

    broadcastChannel.on('broadcast', { event: 'vote' }, () => {
      fetchCounts()
    })

    broadcastChannel.on('broadcast', { event: 'reset' }, () => {
      localStorage.removeItem(`voted_${roomId}`)
      setCounts({ yes: 0, no: 0 })
      setResetSignal((s) => s + 1)
    })

    broadcastChannel.subscribe()
    channelRef.current = broadcastChannel

    // 3️⃣  Polling — bulletproof fallback every 3s
    pollRef.current = setInterval(() => {
      fetchCounts()
    }, POLL_INTERVAL)

    return () => {
      supabase.removeChannel(dbChannel)
      supabase.removeChannel(broadcastChannel)
      clearInterval(pollRef.current)
    }
  }, [roomId, fetchCounts])

  // ── Cast a vote ───────────────────────────────────────
  const castVote = useCallback(
    async (choice) => {
      // Optimistic update
      setCounts((prev) => ({
        yes: prev.yes + (choice ? 1 : 0),
        no: prev.no + (!choice ? 1 : 0),
      }))

      const { error } = await supabase
        .from('votes')
        .insert({ room_id: roomId, choice })

      if (error) {
        console.error('Error casting vote:', error)
        setCounts((prev) => ({
          yes: prev.yes - (choice ? 1 : 0),
          no: prev.no - (!choice ? 1 : 0),
        }))
        throw error
      }

      // Signal other devices instantly
      channelRef.current?.send({
        type: 'broadcast',
        event: 'vote',
        payload: {},
      })
    },
    [roomId]
  )

  // ── Reset all votes for this room ─────────────────────
  const resetVotes = useCallback(async () => {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('room_id', roomId)

    if (error) {
      console.error('Error resetting votes:', error)
      throw error
    }

    // Immediate local reset
    localStorage.removeItem(`voted_${roomId}`)
    setCounts({ yes: 0, no: 0 })
    setResetSignal((s) => s + 1)

    // Signal other devices
    channelRef.current?.send({
      type: 'broadcast',
      event: 'reset',
      payload: {},
    })
  }, [roomId])

  return { counts, loading, castVote, resetVotes, resetSignal }
}

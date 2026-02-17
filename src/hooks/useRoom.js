import { useMemo } from 'react'

/**
 * Reads the `room` query-param from the current URL.
 * If none is present, generates a random 6-char room id and
 * updates the URL (replaceState so no extra history entry).
 */
export function useRoom() {
  const roomId = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    let room = params.get('room')

    if (!room) {
      room = Math.random().toString(36).substring(2, 8) // 6 chars
      const url = new URL(window.location)
      url.searchParams.set('room', room)
      window.history.replaceState({}, '', url)
    }

    return room
  }, [])

  return roomId
}

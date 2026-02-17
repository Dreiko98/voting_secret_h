import { useRoom } from './hooks/useRoom'
import { useVotes } from './hooks/useVotes'
import VoteButtons from './components/VoteButtons'
import ResultsPanel from './components/ResultsPanel'
import ResetButton from './components/ResetButton'
import ShareRoom from './components/ShareRoom'

function App() {
  const roomId = useRoom()
  const { counts, loading, castVote, resetVotes, resetSignal } = useVotes(roomId)

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 py-10 gap-10">
      {/* Header */}
      <header className="text-center space-y-2 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🗳️ Voto Secreto
        </h1>
        <p className="text-slate-500 text-sm">
          Votación anónima · Resultados en tiempo real
        </p>
      </header>

      {/* Share / QR */}
      <ShareRoom roomId={roomId} />

      {/* Vote buttons */}
      <VoteButtons roomId={roomId} onVote={castVote} resetSignal={resetSignal} />

      {/* Divider */}
      <div className="w-full max-w-md border-t border-slate-800" />

      {/* Live results */}
      <ResultsPanel counts={counts} loading={loading} />

      {/* Reset */}
      <ResetButton onReset={resetVotes} />

      {/* Footer */}
      <footer className="text-xs text-slate-700 text-center mt-4">
        Hecho con ⚡ Vite + React + Supabase
      </footer>
    </div>
  )
}

export default App

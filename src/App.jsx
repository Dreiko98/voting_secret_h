import { useRoom } from './hooks/useRoom'
import { useVotes } from './hooks/useVotes'
import VoteButtons from './components/VoteButtons'
import ResultsPanel from './components/ResultsPanel'
import ResetButton from './components/ResetButton'
import ShareRoom from './components/ShareRoom'

// Carmen quotes — rotates randomly on each render
const CARMEN_QUOTES = [
  '"¡VOTAD YA, QUE OS CONOZCO!" — Carmen, La Presidenta',
  '"Yo nunca miento... o sí 🐍" — Carmen',
  '"Carmen lo sabe todo. Carmen lo ve todo." — Ley Nº1',
  '"Si Carmen dice que votes, VOTAS." — Reglamento interno',
  '"El caos es una escalera" — Carmen, probablemente',
  '"Confía en mí... soy liberal 😇" — Carmen (era fascista)',
  '"Carmen no necesita poderes, ella ES el poder" — Anónimo',
  '"¿Quién ha dicho que Carmen es Hitler? ...otra vez" — La mesa',
]

function App() {
  const roomId = useRoom()
  const { counts, loading, castVote, resetVotes, resetSignal } = useVotes(roomId)
  const quote = CARMEN_QUOTES[Math.floor(Math.random() * CARMEN_QUOTES.length)]

  return (
    <div className="min-h-dvh bg-[#1a1008] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h60v60H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M30%205l2%204-2%204-2-4z%22%20fill%3D%22%23ffffff05%22%2F%3E%3C%2Fsvg%3E')] flex flex-col items-center px-4 py-8 gap-8">

      {/* ═══ Header ═══ */}
      <header className="text-center space-y-3 animate-fade-in-up">
        <div className="text-5xl animate-skull">💀</div>
        <h1 className="font-oswald text-5xl sm:text-6xl font-bold uppercase tracking-wider text-[#f5e6c8] drop-shadow-[0_2px_10px_rgba(211,84,0,0.4)]">
          Secret Carmen
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-12 bg-[#d35400]/40" />
          <p className="font-typewriter text-[#d35400] text-xs uppercase tracking-[0.3em]">
            🐍 El voto de la mesa 🐍
          </p>
          <span className="h-px w-12 bg-[#d35400]/40" />
        </div>
      </header>

      {/* ═══ Carmen Quote ═══ */}
      <div className="max-w-sm text-center">
        <p className="font-typewriter text-[#c8a96e] text-sm italic leading-relaxed">
          {quote}
        </p>
      </div>

      {/* ═══ Share / QR ═══ */}
      <ShareRoom roomId={roomId} />

      {/* ═══ Vote buttons ═══ */}
      <VoteButtons roomId={roomId} onVote={castVote} resetSignal={resetSignal} />

      {/* ═══ Divider ═══ */}
      <div className="w-full max-w-md flex items-center gap-3">
        <span className="flex-1 h-px bg-[#3d2b1f]" />
        <span className="text-[#5a3e2a] text-xs font-typewriter">📜 RESULTADOS CLASIFICADOS 📜</span>
        <span className="flex-1 h-px bg-[#3d2b1f]" />
      </div>

      {/* ═══ Live results ═══ */}
      <ResultsPanel counts={counts} loading={loading} />

      {/* ═══ Reset ═══ */}
      <ResetButton onReset={resetVotes} />

      {/* ═══ Footer ═══ */}
      <footer className="text-center space-y-1 mt-4">
        <p className="font-typewriter text-[#3d2b1f] text-xs">
          🕊️ Aprobado por la Presidenta Carmen 🕊️
        </p>
        <p className="text-[#2a1f10] text-[10px]">
          Secret Carmen™ · No affiliation with actual fascists · Carmen sí es real
        </p>
      </footer>
    </div>
  )
}

export default App

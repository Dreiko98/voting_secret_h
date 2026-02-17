import { useMemo } from 'react'

// Carmen's commentary based on results
function getCarmenComment(pctYes, pctNo, total) {
  if (total === 0) return '🫥 Carmen espera impaciente...'
  if (total === 1) return '🤨 Carmen: "¿Solo uno? ¡VOTAD TODOS!"'
  if (pctYes === 100) return '🕊️ Carmen: "Unanimidad liberal... sospechoso"'
  if (pctNo === 100) return '💀 Carmen: "Todos NEIN... ¡esto es un GOLPE!"'
  if (pctYes >= 80) return '😇 Carmen: "Casi todos JA... ¿quién es el topo?"'
  if (pctNo >= 80) return '🐍 Carmen: "Alguien miente y lo voy a descubrir"'
  if (Math.abs(pctYes - pctNo) <= 10) return '⚖️ Carmen: "Empate técnico... DRAMA"'
  return '🔍 Carmen está analizando los votos...'
}

/**
 * ResultsPanel — SH-themed live vote counters (Liberal vs Fascist style).
 */
export default function ResultsPanel({ counts, loading }) {
  const total = counts.yes + counts.no

  const pctYes = useMemo(
    () => (total === 0 ? 0 : Math.round((counts.yes / total) * 100)),
    [counts.yes, total]
  )
  const pctNo = useMemo(
    () => (total === 0 ? 0 : Math.round((counts.no / total) * 100)),
    [counts.no, total]
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-8 h-8 border-4 border-[#d35400] border-t-transparent rounded-full animate-spin" />
        <p className="font-typewriter text-[#5a3e2a] text-xs">Carmen está contando...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in-up">
      {/* Total */}
      <div className="text-center space-y-1">
        <p className="font-oswald text-[#f5e6c8] text-lg uppercase tracking-wider">
          {total} voto{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* JA! bar — Liberal green */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-oswald font-semibold uppercase">
          <span className="text-[#27ae60]">🕊️ JA!</span>
          <span className="text-[#27ae60]">
            {counts.yes} ({pctYes}%)
          </span>
        </div>
        <div className="h-5 bg-[#1a472a]/40 rounded border border-[#27ae60]/20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1a472a] to-[#27ae60] rounded transition-all duration-700 ease-out"
            style={{ width: `${pctYes}%` }}
          />
        </div>
      </div>

      {/* NEIN! bar — Fascist red */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-oswald font-semibold uppercase">
          <span className="text-[#c0392b]">💀 NEIN!</span>
          <span className="text-[#c0392b]">
            {counts.no} ({pctNo}%)
          </span>
        </div>
        <div className="h-5 bg-[#4a1a1a]/40 rounded border border-[#c0392b]/20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4a1a1a] to-[#c0392b] rounded transition-all duration-700 ease-out"
            style={{ width: `${pctNo}%` }}
          />
        </div>
      </div>

      {/* Carmen's live commentary */}
      <div className="text-center pt-2">
        <p className="font-typewriter text-[#c8a96e] text-xs">
          {getCarmenComment(pctYes, pctNo, total)}
        </p>
      </div>
    </div>
  )
}

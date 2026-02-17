import { useMemo } from 'react'

/**
 * ResultsPanel — Shows live YES / NO counters with animated bars.
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
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5 animate-fade-in-up">
      <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500">
        Resultados en vivo
      </h2>

      {/* Total */}
      <p className="text-center text-slate-400 text-sm">
        {total} voto{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
      </p>

      {/* YES bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-emerald-400">👍 SÍ</span>
          <span className="text-emerald-300">
            {counts.yes} ({pctYes}%)
          </span>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pctYes}%` }}
          />
        </div>
      </div>

      {/* NO bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-rose-400">👎 NO</span>
          <span className="text-rose-300">
            {counts.no} ({pctNo}%)
          </span>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pctNo}%` }}
          />
        </div>
      </div>
    </div>
  )
}

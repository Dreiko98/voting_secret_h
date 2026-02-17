import { useState, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'

/**
 * ShareRoom — Shows a QR code + copy-link button for the current room.
 */
export default function ShareRoom({ roomId }) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const roomUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = roomUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [roomUrl])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Room badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Sala</span>
        <code className="text-indigo-400 font-mono font-bold text-sm">{roomId}</code>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-indigo-600 hover:bg-indigo-500
                     text-white text-sm font-medium
                     transition-colors cursor-pointer"
        >
          {copied ? '✅ ¡Copiado!' : '🔗 Copiar enlace'}
        </button>

        <button
          onClick={() => setShowQR((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-slate-800 hover:bg-slate-700 border border-slate-700
                     text-slate-300 text-sm font-medium
                     transition-colors cursor-pointer"
        >
          {showQR ? '✕ Cerrar' : '📱 QR'}
        </button>
      </div>

      {/* QR code */}
      {showQR && (
        <div className="p-4 bg-white rounded-2xl shadow-xl animate-fade-in-up">
          <QRCodeSVG
            value={roomUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="M"
            includeMargin={false}
          />
        </div>
      )}
    </div>
  )
}

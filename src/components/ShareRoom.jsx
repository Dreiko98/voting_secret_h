import { useState, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'

/**
 * ShareRoom — Shows a QR code + copy-link button for the current room.
 */
const PROD_URL = 'https://secret-carmen.vercel.app'

export default function ShareRoom({ roomId }) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // En producción usa el dominio de Vercel, en local usa localhost
  const baseUrl = import.meta.env.PROD ? PROD_URL : window.location.origin
  const roomUrl = `${baseUrl}/?room=${roomId}`

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
      {/* Room badge — styled as classified document */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2a1f10] rounded border border-[#5a3e2a]/50">
        <span className="font-typewriter text-xs text-[#5a3e2a] uppercase">Mesa</span>
        <code className="font-oswald text-[#d35400] font-bold text-sm uppercase">{roomId}</code>
        <span className="font-typewriter text-xs text-[#5a3e2a]">🔒</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-[#d35400] hover:bg-[#e67e22]
                     text-[#f5e6c8] text-sm font-oswald font-semibold uppercase
                     transition-colors cursor-pointer"
        >
          {copied ? '✅ ¡Copiado!' : '📨 Invitar jugador'}
        </button>

        <button
          onClick={() => setShowQR((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-[#2a1f10] hover:bg-[#3d2b1f] border border-[#5a3e2a]/50
                     text-[#c8a96e] text-sm font-oswald uppercase
                     transition-colors cursor-pointer"
        >
          {showQR ? '✕ Cerrar' : '🔍 QR Secreto'}
        </button>
      </div>

      {/* QR code — styled as secret document */}
      {showQR && (
        <div className="flex flex-col items-center gap-2 animate-fade-in-up">
          <div className="p-4 bg-[#f5e6c8] rounded-lg shadow-xl border-2 border-[#3d2b1f]">
            <QRCodeSVG
              value={roomUrl}
              size={200}
              bgColor="#f5e6c8"
              fgColor="#1a1008"
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="font-typewriter text-[10px] text-[#5a3e2a]">
            🤫 Carmen dice: "Comparte esto solo con los de confianza"
          </p>
        </div>
      )}
    </div>
  )
}

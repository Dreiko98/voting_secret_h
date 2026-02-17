# 🗳️ Voto Secreto

**Votación anónima ultra-rápida para juegos de mesa.**
Escanea un QR, vota SÍ o NO, y ve los resultados en tiempo real. Sin login. Sin registros.

## ⚡ Stack

- **Frontend:** React 19 + Vite 7
- **Estilos:** Tailwind CSS v4 (Dark mode / Mobile-first)
- **Backend/DB:** Supabase (PostgreSQL + Realtime)
- **QR:** qrcode.react

## 📁 Estructura de carpetas

```
src/
├── components/
│   ├── VoteButtons.jsx      # Botones SÍ / NO con feedback visual
│   ├── ResultsPanel.jsx     # Barras de resultados en tiempo real
│   ├── ResetButton.jsx      # Reset con long-press de seguridad
│   └── ShareRoom.jsx        # Copiar enlace + QR dinámico
├── hooks/
│   ├── useRoom.js           # Lectura/generación de room_id desde URL
│   └── useVotes.js          # CRUD de votos + suscripción Realtime
├── lib/
│   └── supabaseClient.js    # Cliente Supabase configurado
├── App.jsx                  # Componente principal
├── main.jsx                 # Entry point
└── index.css                # Tailwind + animaciones custom
```

## 🚀 Setup

### 1. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase_setup.sql`.
3. Verifica en **Database → Replication** que la tabla `votes` tiene Realtime activado.

### 2. Variables de entorno

```bash
cp .env.example .env
```

Rellena con tu URL y Anon Key (las encuentras en **Settings → API**).

### 3. Instalar y ejecutar

```bash
npm install
npm run dev
```

### 4. Compartir

- Abre la app y comparte el enlace con `?room=tuSala`
- O muestra el QR desde la app

## 🎮 Uso

1. Los jugadores escanean el QR o abren el enlace
2. Pulsan **SÍ** o **NO** (voto único por dispositivo/sala)
3. Los resultados aparecen en tiempo real para todos
4. El moderador puede **resetear** manteniendo pulsado el botón (1.5s)

## 📜 Licencia

MIT

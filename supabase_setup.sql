-- ============================================================
-- SQL para crear la tabla "votes" en Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS public.votes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id    TEXT NOT NULL,
  choice     BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Índice para consultas por sala (rendimiento)
CREATE INDEX IF NOT EXISTS idx_votes_room_id ON public.votes (room_id);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- 4. Política: Cualquiera puede INSERTAR votos (anónimo)
CREATE POLICY "Allow anonymous inserts"
  ON public.votes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Política: Cualquiera puede LEER votos (anónimo)
CREATE POLICY "Allow anonymous selects"
  ON public.votes
  FOR SELECT
  TO anon
  USING (true);

-- 6. Política: Cualquiera puede BORRAR votos (para el reset)
CREATE POLICY "Allow anonymous deletes"
  ON public.votes
  FOR DELETE
  TO anon
  USING (true);

-- 7. Habilitar Realtime en la tabla
--    (Alternativa: ir a Database → Replication y activar "votes")
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;

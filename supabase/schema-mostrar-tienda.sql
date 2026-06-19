-- Migración: campo mostrar_en_tienda para control de visibilidad en tienda pública
-- Ejecutar en SQL Editor de Supabase

-- 1. Agregar columna (DEFAULT false — opt-in explícito)
ALTER TABLE uniks_productos
  ADD COLUMN IF NOT EXISTS mostrar_en_tienda BOOLEAN NOT NULL DEFAULT false;

-- 2. Reemplazar RLS policy pública
-- La anterior filtraba por stock > 0; ahora el control es explícito por producto
DROP POLICY IF EXISTS "Allow public read products" ON uniks_productos;

CREATE POLICY "Allow public read products"
  ON uniks_productos
  FOR SELECT
  USING (mostrar_en_tienda = true);

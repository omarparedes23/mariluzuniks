-- Migración: Agregar campo descripcion a productos para la tienda online
-- Ejecutar en SQL Editor de Supabase

-- 1. Agregar columna descripcion
ALTER TABLE uniks_productos
  ADD COLUMN IF NOT EXISTS descripcion TEXT;

-- 2. Política RLS pública: permitir lectura anónima de productos
-- (solo productos con stock > 0 para la tienda)
CREATE POLICY "Allow public read products"
  ON uniks_productos
  FOR SELECT
  USING (stock > 0);

-- 3. Política RLS pública: permitir lectura de servicios (para referencia)
CREATE POLICY "Allow public read services"
  ON uniks_servicios
  FOR SELECT
  USING (true);

-- ============================================
-- SCHEMA UPDATE: Payment Multiple Services
-- ============================================
-- Ejecutar en SQL Editor de Supabase
-- NOTA: Hacer backup de uniks_pagos antes de ejecutar

-- 1. Crear tabla de detalle para servicios por pago
CREATE TABLE IF NOT EXISTS uniks_pago_servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pago_id UUID NOT NULL REFERENCES uniks_pagos(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES uniks_servicios(id) ON DELETE SET NULL,
  precio_aplicado DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agregar columna cliente_nombre a pagos
ALTER TABLE uniks_pagos 
ADD COLUMN IF NOT EXISTS cliente_nombre TEXT,
ADD COLUMN IF NOT EXISTS monto_total DECIMAL(10,2);

-- 3. Migrar datos existentes: calcular monto_total desde monto
UPDATE uniks_pagos SET monto_total = monto WHERE monto_total IS NULL;

-- 4. Hacer monto_total NOT NULL después de migrar
ALTER TABLE uniks_pagos ALTER COLUMN monto_total SET NOT NULL;

-- 5. Migrar servicios existentes a tabla de detalle
-- (Solo si hay datos existentes con servicio_id)
INSERT INTO uniks_pago_servicios (pago_id, servicio_id, precio_aplicado)
SELECT 
  id as pago_id,
  servicio_id,
  monto as precio_aplicado
FROM uniks_pagos
WHERE servicio_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM uniks_pago_servicios ups WHERE ups.pago_id = uniks_pagos.id
  );

-- 6. Opcional: quitar columna servicio_id y monto antiguos
-- NOTA: Solo ejecutar después de verificar que la migración funcionó
-- ALTER TABLE uniks_pagos DROP COLUMN IF EXISTS servicio_id;
-- ALTER TABLE uniks_pagos DROP COLUMN IF EXISTS monto;

-- 7. RLS policies para nueva tabla
ALTER TABLE uniks_pago_servicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to authenticated users" ON uniks_pago_servicios
  FOR ALL USING (auth.role() = 'authenticated');

-- 8. Índices para performance
CREATE INDEX IF NOT EXISTS idx_pago_servicios_pago_id ON uniks_pago_servicios(pago_id);
CREATE INDEX IF NOT EXISTS idx_pago_servicios_servicio_id ON uniks_pago_servicios(servicio_id);
CREATE INDEX IF NOT EXISTS idx_pagos_cliente_nombre ON uniks_pagos(cliente_nombre);

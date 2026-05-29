-- ============================================================
-- Modulo: control-stock
-- ============================================================

CREATE TABLE IF NOT EXISTS uniks_control_sesiones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_inicio DATE NOT NULL,
  fecha_fin    DATE NOT NULL,
  notas        TEXT,
  estado       TEXT NOT NULL DEFAULT 'borrador'
               CHECK (estado IN ('borrador', 'cerrada')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (fecha_fin >= fecha_inicio)
);

CREATE TABLE IF NOT EXISTS uniks_control_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id      UUID NOT NULL REFERENCES uniks_control_sesiones(id) ON DELETE CASCADE,
  producto_id    UUID NOT NULL REFERENCES uniks_productos(id) ON DELETE RESTRICT,
  stock_anterior INTEGER NOT NULL DEFAULT 0,
  stock_contado  INTEGER NULL CHECK (stock_contado >= 0),
  costo_unitario NUMERIC(10,2),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sesion_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_control_items_sesion_id   ON uniks_control_items(sesion_id);
CREATE INDEX IF NOT EXISTS idx_control_items_producto_id ON uniks_control_items(producto_id);
CREATE INDEX IF NOT EXISTS idx_control_sesiones_estado   ON uniks_control_sesiones(estado);
CREATE INDEX IF NOT EXISTS idx_control_sesiones_fecha_fin ON uniks_control_sesiones(fecha_fin DESC);

-- Solo una sesion borrador a la vez
CREATE UNIQUE INDEX IF NOT EXISTS uniq_control_sesiones_borrador
  ON uniks_control_sesiones(estado) WHERE estado = 'borrador';

-- Trigger updated_at (reuse existing function update_updated_at_column)
CREATE TRIGGER update_uniks_control_sesiones_updated_at
  BEFORE UPDATE ON uniks_control_sesiones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE uniks_control_sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniks_control_items    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to authenticated users" ON uniks_control_sesiones
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all to authenticated users" ON uniks_control_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Helper RPCs (computed live, not stored)
-- ============================================================

CREATE OR REPLACE FUNCTION get_compras_en_periodo(
  p_producto_id UUID,
  p_inicio      DATE,
  p_fin         DATE
) RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(ci.cantidad), 0)::INTEGER
  FROM uniks_compra_items ci
  JOIN uniks_compras c ON c.id = ci.compra_id
  WHERE ci.producto_id = p_producto_id
    AND c.fecha BETWEEN p_inicio AND p_fin;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_ajustes_en_periodo(
  p_producto_id UUID,
  p_inicio      DATE,
  p_fin         DATE
) RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(a.stock_nuevo - a.stock_anterior), 0)::INTEGER
  FROM uniks_ajustes_stock a
  WHERE a.producto_id = p_producto_id
    AND (a.fecha::date) BETWEEN p_inicio AND p_fin
    AND (a.motivo IS NULL OR a.motivo NOT LIKE 'control_stock%');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- Stored procedure: cierre atomico
-- ============================================================

CREATE OR REPLACE FUNCTION close_control_sesion(p_sesion_id UUID)
RETURNS void AS $$
DECLARE
  v_sesion      uniks_control_sesiones%ROWTYPE;
  v_item        RECORD;
  v_compras     INTEGER;
  v_ajustes     INTEGER;
  v_consumo     INTEGER;
  v_stock_curr  INTEGER;
  v_pendientes  INTEGER;
BEGIN
  SELECT * INTO v_sesion
  FROM uniks_control_sesiones
  WHERE id = p_sesion_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sesion no encontrada: %', p_sesion_id;
  END IF;

  IF v_sesion.estado <> 'borrador' THEN
    RAISE EXCEPTION 'La sesion ya esta cerrada';
  END IF;

  SELECT COUNT(*) INTO v_pendientes
  FROM uniks_control_items
  WHERE sesion_id = p_sesion_id AND stock_contado IS NULL;

  IF v_pendientes > 0 THEN
    RAISE EXCEPTION 'Faltan % productos por contar', v_pendientes;
  END IF;

  FOR v_item IN
    SELECT id, producto_id, stock_anterior, stock_contado
    FROM uniks_control_items
    WHERE sesion_id = p_sesion_id
  LOOP
    v_compras := get_compras_en_periodo(v_item.producto_id, v_sesion.fecha_inicio, v_sesion.fecha_fin);
    v_ajustes := get_ajustes_en_periodo(v_item.producto_id, v_sesion.fecha_inicio, v_sesion.fecha_fin);
    v_consumo := v_item.stock_anterior + v_compras + v_ajustes - v_item.stock_contado;

    SELECT stock INTO v_stock_curr
    FROM uniks_productos
    WHERE id = v_item.producto_id
    FOR UPDATE;

    INSERT INTO uniks_ajustes_stock (
      producto_id, stock_anterior, stock_nuevo, motivo, fecha
    ) VALUES (
      v_item.producto_id,
      v_stock_curr,
      v_stock_curr - v_consumo,
      'control_stock:' || p_sesion_id::text,
      v_sesion.fecha_fin
    );

    PERFORM adjust_producto_stock(v_item.producto_id, -v_consumo);
  END LOOP;

  UPDATE uniks_control_sesiones
  SET estado = 'cerrada', updated_at = NOW()
  WHERE id = p_sesion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

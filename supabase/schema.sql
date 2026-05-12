-- Tablas para Admin Dashboard System - Unik's Salon Spa
-- Ejecutar en SQL Editor de Supabase

-- Tabla de Productos (Inventario)
CREATE TABLE IF NOT EXISTS uniks_productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url_r2 VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Servicios
CREATE TABLE IF NOT EXISTS uniks_servicios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  duracion INTEGER NOT NULL CHECK (duracion > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Pagos/Transacciones
CREATE TABLE IF NOT EXISTS uniks_pagos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia')),
  fecha TIMESTAMPTZ DEFAULT NOW(),
  servicio_id UUID REFERENCES uniks_servicios(id) ON DELETE SET NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para actualizar updated_at en productos
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_uniks_productos_updated_at 
  BEFORE UPDATE ON uniks_productos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uniks_servicios_updated_at 
  BEFORE UPDATE ON uniks_servicios 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE uniks_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniks_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniks_pagos ENABLE ROW LEVEL SECURITY;

-- Permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Allow all to authenticated users" ON uniks_productos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all to authenticated users" ON uniks_servicios
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all to authenticated users" ON uniks_pagos
  FOR ALL USING (auth.role() = 'authenticated');

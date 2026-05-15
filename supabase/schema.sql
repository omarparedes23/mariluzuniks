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

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS uniks_clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),
  email VARCHAR(255),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda de clientes
CREATE INDEX IF NOT EXISTS idx_uniks_clientes_nombre ON uniks_clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_uniks_clientes_telefono ON uniks_clientes(telefono);
CREATE INDEX IF NOT EXISTS idx_uniks_clientes_email ON uniks_clientes(email);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS uniks_proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  ruc TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para actualizar updated_at en proveedores
CREATE TRIGGER update_uniks_proveedores_updated_at
  BEFORE UPDATE ON uniks_proveedores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) para proveedores
ALTER TABLE uniks_proveedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to authenticated users" ON uniks_proveedores
  FOR ALL USING (auth.role() = 'authenticated');

-- Tabla de Pagos/Transacciones
CREATE TABLE IF NOT EXISTS uniks_pagos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia', 'yape')),
  fecha TIMESTAMPTZ DEFAULT NOW(),
  servicio_id UUID REFERENCES uniks_servicios(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES uniks_clientes(id) ON DELETE SET NULL,
  descripcion TEXT,
  numero_operacion TEXT,
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

CREATE TRIGGER update_uniks_clientes_updated_at 
  BEFORE UPDATE ON uniks_clientes 
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

CREATE POLICY "Allow all to authenticated users" ON uniks_clientes
  FOR ALL USING (auth.role() = 'authenticated');

-- Enum para categorías de gastos
DO $$ BEGIN
  CREATE TYPE gasto_categoria AS ENUM ('insumos', 'servicios', 'alquiler', 'marketing', 'otros');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enum para método de pago de gastos
DO $$ BEGIN
  CREATE TYPE gasto_metodo_pago AS ENUM ('efectivo', 'transferencia', 'yape');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enum para tipo de comprobante de gastos
DO $$ BEGIN
  CREATE TYPE gasto_tipo_comprobante AS ENUM ('factura', 'boleta', 'ticket', 'sin_comprobante');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tabla de Gastos
CREATE TABLE IF NOT EXISTS uniks_gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  monto DECIMAL(10,2) NOT NULL,
  categoria gasto_categoria NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  descripcion TEXT,
  metodo_pago gasto_metodo_pago NOT NULL,
  proveedor_id UUID REFERENCES uniks_proveedores(id) ON DELETE SET NULL,
  proveedor_nombre TEXT,
  tipo_comprobante gasto_tipo_comprobante,
  numero_comprobante TEXT,
  numero_operacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para filtrado
CREATE INDEX IF NOT EXISTS idx_uniks_gastos_categoria ON uniks_gastos(categoria);
CREATE INDEX IF NOT EXISTS idx_uniks_gastos_fecha ON uniks_gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_uniks_gastos_proveedor_id ON uniks_gastos(proveedor_id);

-- Trigger para actualizar updated_at en gastos
CREATE TRIGGER update_uniks_gastos_updated_at
  BEFORE UPDATE ON uniks_gastos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) para gastos
ALTER TABLE uniks_gastos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to authenticated users" ON uniks_gastos
  FOR ALL USING (auth.role() = 'authenticated');

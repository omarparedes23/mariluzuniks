-- Agrega precio_publico a uniks_productos
-- Este es el precio que se muestra en la tienda online al público.
-- precio_costo = lo que paga el negocio al proveedor
-- precio       = referencia interna (precio_costo * 1.18), solo lectura en admin
-- precio_publico = precio real de venta al público en la tienda

ALTER TABLE uniks_productos
  ADD COLUMN IF NOT EXISTS precio_publico NUMERIC(10,2);

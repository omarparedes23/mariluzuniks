export interface Producto {
  id: string
  nombre: string
  codigo: string | null
  stock: number
  stock_minimo: number
  precio_costo: number | null
  precio: number
  imagen_url_r2: string | null
  created_at: string
  updated_at: string
}

export interface Servicio {
  id: string
  nombre: string
  precio: number
  duracion: number
  created_at?: string
  updated_at?: string
}

export interface Cliente {
  id: string
  nombre: string
  telefono: string | null
  email: string | null
  notas: string | null
  created_at: string
  updated_at: string
}

export interface PagoServicio {
  id: string
  pago_id?: string
  servicio_id: string | null
  precio_aplicado: number
  servicio?: Servicio | null
  created_at?: string
}

export interface Pago {
  id: string
  monto_total: number
  metodo_pago: 'efectivo' | 'transferencia' | 'yape'
  fecha: string
  cliente_id: string | null
  cliente_nombre: string | null
  descripcion: string | null
  numero_operacion: string | null
  servicios?: PagoServicio[]
  cliente?: Cliente | null
  created_at: string
}

export interface ActionResult<T = unknown> {
  success: boolean
  error?: string
  data?: T
}

export interface PaymentSummary {
  total: number
  efectivo: number
  transferencia: number
  yape: number
  count: number
}

export type GastoCategoria = 'insumos' | 'servicios' | 'alquiler' | 'marketing' | 'otros'

export type GastoMetodoPago = 'efectivo' | 'transferencia' | 'yape'

export type GastoTipoComprobante = 'factura' | 'boleta' | 'ticket' | 'sin_comprobante'

export interface Proveedor {
  id: string
  nombre: string
  telefono: string | null
  ruc: string | null
  notas: string | null
  created_at: string
  updated_at: string
}

export interface Gasto {
  id: string
  monto: number
  categoria: GastoCategoria
  fecha: string
  descripcion: string | null
  metodo_pago: GastoMetodoPago
  proveedor_id: string | null
  proveedor_nombre: string | null
  tipo_comprobante: GastoTipoComprobante | null
  numero_comprobante: string | null
  numero_operacion: string | null
  proveedor?: Proveedor | null
  created_at: string
  updated_at: string
}

export interface Compra {
  id: string
  proveedor_id: string | null
  proveedor?: Proveedor | null
  fecha: string
  tipo_comprobante: GastoTipoComprobante
  numero_comprobante: string | null
  metodo_pago: GastoMetodoPago
  total: number
  notas: string | null
  items?: CompraItem[]
  created_at: string
  updated_at: string
}

export interface CompraItem {
  id: string
  compra_id: string
  producto_id: string
  producto?: Pick<Producto, 'id' | 'nombre' | 'codigo' | 'stock'> | null
  cantidad: number
  precio_unitario: number
  subtotal: number
  created_at: string
}

export interface AjusteStock {
  id: string
  producto_id: string
  producto?: Pick<Producto, 'id' | 'nombre' | 'codigo'> | null
  stock_anterior: number
  stock_nuevo: number
  motivo: string | null
  fecha: string
  created_at: string
}

export interface PaymentFormData {
  monto_total: number
  metodo_pago: 'efectivo' | 'transferencia' | 'yape'
  cliente_nombre: string
  descripcion: string
  fecha: string
  numero_operacion: string
  servicios: {
    servicio_id: string
    precio_aplicado: number
  }[]
}

export interface ExpenseFormData {
  monto: number
  categoria: GastoCategoria
  fecha: string
  descripcion: string
  metodo_pago: GastoMetodoPago
  proveedor_id: string
  proveedor_nombre: string
  tipo_comprobante: GastoTipoComprobante
  numero_comprobante: string
  numero_operacion: string
}

// ============================================================
// Control Stock
// ============================================================

export type ControlEstado = 'borrador' | 'cerrada'

export interface ControlSesion {
  id: string
  fecha_inicio: string
  fecha_fin: string
  notas: string | null
  estado: ControlEstado
  created_at: string
  updated_at: string
}

export interface ControlItem {
  id: string
  sesion_id: string
  producto_id: string
  producto?: {
    id: string
    nombre: string
    codigo: string | null
    stock: number
    precio_costo: number | null
  } | null
  stock_anterior: number
  stock_contado: number | null
  costo_unitario: number | null
  // computed in server actions (NOT in DB)
  compras_en_periodo: number
  ajustes_en_periodo: number
  consumo_calculado: number | null  // null if stock_contado is null
  costo_total: number | null        // null if costo_unitario is null
  created_at: string
}

export interface ControlSesionConItems extends ControlSesion {
  items: ControlItem[]
}

export interface ControlResumen {
  sesion: ControlSesion
  items: ControlItem[]
  total_unidades_consumidas: number
  total_costo: number
  productos_sin_costo: number
  ingresos: number
  margen_bruto: number
  margen_pct: number | null
}

export interface CreateControlSesionInput {
  fecha_inicio: string
  fecha_fin: string
  notas?: string
}

export interface Producto {
  id: string
  nombre: string
  stock: number
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

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
  metodo_pago: 'efectivo' | 'transferencia'
  fecha: string
  cliente_nombre: string | null
  descripcion: string | null
  servicios?: PagoServicio[]
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
  count: number
}

export interface PaymentFormData {
  monto_total: number
  metodo_pago: 'efectivo' | 'transferencia'
  cliente_nombre: string
  descripcion: string
  fecha: string
  servicios: {
    servicio_id: string
    precio_aplicado: number
  }[]
}

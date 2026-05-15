export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      uniks_productos: {
        Row: {
          id: string
          nombre: string
          stock: number
          precio: number
          imagen_url_r2: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          stock?: number
          precio: number
          imagen_url_r2?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          stock?: number
          precio?: number
          imagen_url_r2?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      uniks_servicios: {
        Row: {
          id: string
          nombre: string
          precio: number
          duracion: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          precio: number
          duracion: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          precio?: number
          duracion?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      uniks_clientes: {
        Row: {
          id: string
          nombre: string
          telefono: string | null
          email: string | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          telefono?: string | null
          email?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          telefono?: string | null
          email?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      uniks_proveedores: {
        Row: {
          id: string
          nombre: string
          telefono: string | null
          ruc: string | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          telefono?: string | null
          ruc?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          telefono?: string | null
          ruc?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      uniks_pagos: {
        Row: {
          id: string
          monto_total: number
          metodo_pago: 'efectivo' | 'transferencia' | 'yape'
          fecha: string
          cliente_id: string | null
          cliente_nombre: string | null
          descripcion: string | null
          numero_operacion: string | null
          created_at: string
        }
        Insert: {
          id?: string
          monto_total: number
          metodo_pago: 'efectivo' | 'transferencia' | 'yape'
          fecha?: string
          cliente_id?: string | null
          cliente_nombre?: string | null
          descripcion?: string | null
          numero_operacion?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          monto_total?: number
          metodo_pago?: 'efectivo' | 'transferencia' | 'yape'
          fecha?: string
          cliente_id?: string | null
          cliente_nombre?: string | null
          descripcion?: string | null
          numero_operacion?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniks_pagos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "uniks_clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      uniks_pago_servicios: {
        Row: {
          id: string
          pago_id: string
          servicio_id: string | null
          precio_aplicado: number
          created_at: string
        }
        Insert: {
          id?: string
          pago_id: string
          servicio_id?: string | null
          precio_aplicado: number
          created_at?: string
        }
        Update: {
          id?: string
          pago_id?: string
          servicio_id?: string | null
          precio_aplicado?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniks_pago_servicios_pago_id_fkey"
            columns: ["pago_id"]
            isOneToOne: false
            referencedRelation: "uniks_pagos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniks_pago_servicios_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "uniks_servicios"
            referencedColumns: ["id"]
          }
        ]
      }
      uniks_gastos: {
        Row: {
          id: string
          monto: number
          categoria: 'insumos' | 'servicios' | 'alquiler' | 'marketing' | 'otros'
          fecha: string
          descripcion: string | null
          metodo_pago: 'efectivo' | 'transferencia' | 'yape'
          proveedor_id: string | null
          proveedor_nombre: string | null
          tipo_comprobante: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante' | null
          numero_comprobante: string | null
          numero_operacion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          monto: number
          categoria: 'insumos' | 'servicios' | 'alquiler' | 'marketing' | 'otros'
          fecha?: string
          descripcion?: string | null
          metodo_pago: 'efectivo' | 'transferencia' | 'yape'
          proveedor_id?: string | null
          proveedor_nombre?: string | null
          tipo_comprobante?: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante' | null
          numero_comprobante?: string | null
          numero_operacion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          monto?: number
          categoria?: 'insumos' | 'servicios' | 'alquiler' | 'marketing' | 'otros'
          fecha?: string
          descripcion?: string | null
          metodo_pago?: 'efectivo' | 'transferencia' | 'yape'
          proveedor_id?: string | null
          proveedor_nombre?: string | null
          tipo_comprobante?: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante' | null
          numero_comprobante?: string | null
          numero_operacion?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniks_gastos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "uniks_proveedores"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gasto_tipo_comprobante: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

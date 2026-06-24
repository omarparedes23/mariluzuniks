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
          codigo: string | null
          stock: number
          stock_minimo: number
          precio_costo: number | null
          precio: number
          precio_publico: number | null
          imagen_url_r2: string | null
          descripcion: string | null
          fecha_caducidad: string | null
          mostrar_en_tienda: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          codigo?: string | null
          stock?: number
          stock_minimo?: number
          precio_costo?: number | null
          precio: number
          precio_publico?: number | null
          imagen_url_r2?: string | null
          descripcion?: string | null
          fecha_caducidad?: string | null
          mostrar_en_tienda?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          codigo?: string | null
          stock?: number
          stock_minimo?: number
          precio_costo?: number | null
          precio?: number
          precio_publico?: number | null
          imagen_url_r2?: string | null
          descripcion?: string | null
          fecha_caducidad?: string | null
          mostrar_en_tienda?: boolean
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
      uniks_compras: {
        Row: {
          id: string
          proveedor_id: string | null
          fecha: string
          tipo_comprobante: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante'
          numero_comprobante: string | null
          metodo_pago: 'efectivo' | 'transferencia' | 'yape'
          total: number
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proveedor_id?: string | null
          fecha: string
          tipo_comprobante: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante'
          numero_comprobante?: string | null
          metodo_pago: 'efectivo' | 'transferencia' | 'yape'
          total: number
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proveedor_id?: string | null
          fecha?: string
          tipo_comprobante?: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante'
          numero_comprobante?: string | null
          metodo_pago?: 'efectivo' | 'transferencia' | 'yape'
          total?: number
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniks_compras_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "uniks_proveedores"
            referencedColumns: ["id"]
          }
        ]
      }
      uniks_compra_items: {
        Row: {
          id: string
          compra_id: string
          producto_id: string
          cantidad: number
          precio_unitario: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          compra_id: string
          producto_id: string
          cantidad: number
          precio_unitario: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          compra_id?: string
          producto_id?: string
          cantidad?: number
          precio_unitario?: number
          subtotal?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniks_compra_items_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "uniks_compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniks_compra_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "uniks_productos"
            referencedColumns: ["id"]
          }
        ]
      }
      uniks_ajustes_stock: {
        Row: {
          id: string
          producto_id: string
          stock_anterior: number
          stock_nuevo: number
          motivo: string | null
          fecha: string
          created_at: string
        }
        Insert: {
          id?: string
          producto_id: string
          stock_anterior: number
          stock_nuevo: number
          motivo?: string | null
          fecha?: string
          created_at?: string
        }
        Update: {
          id?: string
          producto_id?: string
          stock_anterior?: number
          stock_nuevo?: number
          motivo?: string | null
          fecha?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniks_ajustes_stock_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "uniks_productos"
            referencedColumns: ["id"]
          }
        ]
      }
      uniks_control_sesiones: {
        Row: {
          id: string
          fecha_inicio: string
          fecha_fin: string
          notas: string | null
          estado: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fecha_inicio: string
          fecha_fin: string
          notas?: string | null
          estado?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fecha_inicio?: string
          fecha_fin?: string
          notas?: string | null
          estado?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      uniks_control_items: {
        Row: {
          id: string
          sesion_id: string
          producto_id: string
          stock_anterior: number
          stock_contado: number | null
          costo_unitario: number | null
          created_at: string
        }
        Insert: {
          id?: string
          sesion_id: string
          producto_id: string
          stock_anterior?: number
          stock_contado?: number | null
          costo_unitario?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          sesion_id?: string
          producto_id?: string
          stock_anterior?: number
          stock_contado?: number | null
          costo_unitario?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniks_control_items_sesion_id_fkey"
            columns: ["sesion_id"]
            isOneToOne: false
            referencedRelation: "uniks_control_sesiones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniks_control_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "uniks_productos"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_producto_stock: {
        Args: { p_producto_id: string; p_delta: number }
        Returns: undefined
      }
      close_control_sesion: {
        Args: { p_sesion_id: string }
        Returns: undefined
      }
      get_compras_en_periodo: {
        Args: { p_producto_id: string; p_inicio: string; p_fin: string }
        Returns: number
      }
      get_ajustes_en_periodo: {
        Args: { p_producto_id: string; p_inicio: string; p_fin: string }
        Returns: number
      }
    }
    Enums: {
      gasto_tipo_comprobante: 'factura' | 'boleta' | 'ticket' | 'sin_comprobante'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
      uniks_pagos: {
        Row: {
          id: string
          monto_total: number
          metodo_pago: 'efectivo' | 'transferencia'
          fecha: string
          cliente_nombre: string | null
          descripcion: string | null
          created_at: string
        }
        Insert: {
          id?: string
          monto_total: number
          metodo_pago: 'efectivo' | 'transferencia'
          fecha?: string
          cliente_nombre?: string | null
          descripcion?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          monto_total?: number
          metodo_pago?: 'efectivo' | 'transferencia'
          fecha?: string
          cliente_nombre?: string | null
          descripcion?: string | null
          created_at?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

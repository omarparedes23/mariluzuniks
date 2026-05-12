import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testInsert() {
  console.log('Testing insert to uniks_pagos...')
  const { data, error } = await supabase
    .from('uniks_pagos')
    .insert({
      monto: 100,
      metodo_pago: 'efectivo',
      fecha: new Date().toISOString()
    })
    .select()

  if (error) {
    console.error('ERROR:', JSON.stringify(error, null, 2))
  } else {
    console.log('SUCCESS:', data)
  }
}

testInsert()

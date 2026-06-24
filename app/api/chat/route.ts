import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getPublicProducts } from '@/lib/actions/tienda'

const isOpenAI = process.env.AI_PROVIDER === 'openai'

const client = new OpenAI({
  apiKey: isOpenAI ? process.env.OPENAI_API_KEY : process.env.DEEPSEEK_API_KEY,
  ...(isOpenAI ? {} : { baseURL: 'https://api.deepseek.com' }),
})

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const PRODUCT_KEYWORDS = ['producto', 'productos', 'tienda', 'comprar', 'venta', 'venden', 'vendes', 'vende', 'vendo']

function mentionsProducts(messages: ChatMessage[]): boolean {
  return messages.slice(-3).some(m =>
    PRODUCT_KEYWORDS.some(kw => m.content.toLowerCase().includes(kw))
  )
}

export async function POST(request: Request) {
  const { messages }: { messages: ChatMessage[] } = await request.json()

  const systemPrompt = readFileSync(
    join(process.cwd(), 'data', 'chatbot-context.md'),
    'utf-8'
  )

  const PRODUCTS_LIMIT = 8

  let productsContext = ''
  if (mentionsProducts(messages)) {
    const allProducts = await getPublicProducts()
    if (allProducts.length > 0) {
      const preview = allProducts.slice(0, PRODUCTS_LIMIT)
      const hasMore = allProducts.length > PRODUCTS_LIMIT
      productsContext =
        '\n\n## PRODUCTOS EN VENTA\nActualmente tenemos los siguientes productos disponibles en nuestra tienda online:\n' +
        preview
          .map(p => `- ${p.nombre}: S/ ${p.precio}${p.descripcion ? ` — ${p.descripcion}` : ''}`)
          .join('\n') +
        (hasMore
          ? `\n(y ${allProducts.length - PRODUCTS_LIMIT} productos más disponibles en la tienda)`
          : '') +
        '\nPara ver el catálogo completo visita https://unikssalonspa.pe/tienda. También puedes consultar por WhatsApp al wa.me/51941719794.'
    } else {
      productsContext =
        '\n\n## PRODUCTOS EN VENTA\nActualmente no tenemos productos disponibles en tienda. Redirige al WhatsApp si preguntan.'
    }
  }

  const stream = await client.chat.completions.create({
    model: isOpenAI ? 'gpt-4o-mini' : 'deepseek-chat',
    messages: [{ role: 'system', content: systemPrompt + productsContext }, ...messages],
    stream: true,
    max_tokens: 400,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new NextResponse(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

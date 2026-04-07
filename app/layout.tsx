import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Uniks Salón & Spa | Peluquería y Belleza en San Borja, Lima',
  description:
    'Especialistas en mechas brasileras, keratina, tratamientos capilares, manicure y más. Ubicados en San Borja, Lima. Reserva tu cita por WhatsApp.',
  keywords: [
    'salon de belleza san borja',
    'mechas brasileras lima',
    'keratina lima',
    'tratamientos capilares',
    'manicure san borja',
    'uniks salon spa',
    'peluqueria san borja',
  ],
  openGraph: {
    title: 'Uniks Salón & Spa | San Borja, Lima',
    description:
      'Especialistas en mechas, keratina, tratamientos capilares y más. Reserva tu cita por WhatsApp.',
    type: 'website',
    locale: 'es_PE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-bg text-cream font-sans antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}

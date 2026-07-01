import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

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
  metadataBase: new URL('https://www.unikssalonspa.pe'),
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
    url: 'https://www.unikssalonspa.pe/',
    siteName: 'Uniks Salón & Spa',
    type: 'website',
    locale: 'es_PE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1440,
        height: 1440,
        alt: 'Uniks Salón & Spa — Staff',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniks Salón & Spa | San Borja, Lima',
    description:
      'Especialistas en mechas, keratina, tratamientos capilares y más. Reserva tu cita por WhatsApp.',
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'Uniks Salón & Spa',
  image: 'https://www.unikssalonspa.pe/og-image.jpg',
  telephone: '+51 941 719 794',
  email: 'mariluzrodriguezmerino27@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Scarlatti 208',
    addressLocality: 'San Borja',
    addressRegion: 'Lima',
    addressCountry: 'PE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -12.106,
    longitude: -76.995,
  },
  url: 'https://www.unikssalonspa.pe',
  sameAs: [
    'https://www.instagram.com/unikssalonspa',
    'https://www.facebook.com/share/14YEPYgBVai/',
    'https://www.tiktok.com/@unikssalon',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: 'S/ 30 - S/ 500',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-bg text-cream font-sans antialiased">
        {/* Schema.org LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  )
}

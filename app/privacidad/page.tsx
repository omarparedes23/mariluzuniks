import Footer from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad | Uniks Salón & Spa',
  description: 'Información sobre el tratamiento de datos personales en Uniks Salón & Spa, conforme a la Ley N° 29733.',
}

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Mini navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-[8px] border-b border-gold/10">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-serif text-lg text-gold tracking-wide">Uniks</span>
          </Link>

          <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold/50">
            Privacidad
          </span>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="font-sans text-gold/60 text-[0.7rem] tracking-[0.5em] uppercase mb-4">
            Información legal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-cream leading-tight mb-4">
            Política de{' '}
            <span className="text-gold italic">Privacidad</span>
          </h1>
          <div className="mx-auto my-6 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <p className="font-sans text-cream/50 text-sm leading-relaxed">
            Última actualización: junio 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 lg:px-8 pb-24 space-y-12">

        <div className="border-l-2 border-gold/20 pl-6 space-y-3">
          <h2 className="font-serif text-xl text-gold">Responsable del tratamiento</h2>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            <span className="text-cream/80">Unik&apos;s Salón & Spa</span><br />
            Scarlatti 208, San Borja, Lima, Perú<br />
            Contacto:{' '}
            <a
              href="mailto:mariluzrodriguezmerino27@gmail.com"
              className="text-gold/70 hover:text-gold transition-colors underline underline-offset-4"
            >
              mariluzrodriguezmerino27@gmail.com
            </a>
            {' '}· WhatsApp:{' '}
            <a
              href="https://wa.me/51941719794"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/70 hover:text-gold transition-colors underline underline-offset-4"
            >
              wa.me/51941719794
            </a>
          </p>
        </div>

        <div className="border-l-2 border-gold/20 pl-6 space-y-3">
          <h2 className="font-serif text-xl text-gold">Sitio web e información de navegación</h2>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            Este sitio web tiene carácter informativo. No recopilamos datos personales de los visitantes
            a través de formularios de registro ni utilizamos cookies de seguimiento o perfilamiento.
          </p>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            El servidor de alojamiento (Vercel) puede registrar datos técnicos de acceso como dirección IP
            y agente de navegador, conforme a sus propios términos de servicio, con fines de seguridad y
            estabilidad de la plataforma.
          </p>
        </div>

        <div className="border-l-2 border-gold/20 pl-6 space-y-3">
          <h2 className="font-serif text-xl text-gold">Asistente virtual (chatbot)</h2>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            Nuestro sitio cuenta con un asistente virtual de carácter informativo. Las conversaciones
            son procesadas por <span className="text-cream/80">OpenAI</span> (Estados Unidos) únicamente
            para generar respuestas en tiempo real. Unik&apos;s Salón & Spa no almacena el contenido de
            estas conversaciones en sus propios sistemas.
          </p>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            Le recomendamos no compartir información personal sensible a través del chat.
            Para consultas confidenciales, contáctenos directamente por WhatsApp o correo electrónico.
          </p>
        </div>

        <div className="border-l-2 border-gold/20 pl-6 space-y-3">
          <h2 className="font-serif text-xl text-gold">Datos de clientes del salón</h2>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            La información de clientes registrada en nuestro sistema interno (nombre, historial de
            servicios y compras) es tratada exclusivamente por el personal del salón con fines
            de gestión operativa, conforme a la{' '}
            <span className="text-cream/80">Ley N° 29733 — Ley de Protección de Datos Personales</span>
            {' '}y su Reglamento (DS 003-2013-JUS).
          </p>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            Esta información no es compartida con terceros ni utilizada con fines comerciales ajenos
            al servicio prestado.
          </p>
        </div>

        <div className="border-l-2 border-gold/20 pl-6 space-y-3">
          <h2 className="font-serif text-xl text-gold">Derechos ARCO</h2>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            De acuerdo con la Ley N° 29733, usted tiene derecho a acceder, rectificar, cancelar
            u oponerse al tratamiento de sus datos personales (derechos ARCO).
            Para ejercer cualquiera de estos derechos, puede escribirnos a:
          </p>
          <p className="font-sans text-sm">
            <a
              href="mailto:mariluzrodriguezmerino27@gmail.com"
              className="text-gold/70 hover:text-gold transition-colors underline underline-offset-4"
            >
              mariluzrodriguezmerino27@gmail.com
            </a>
          </p>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            Atenderemos su solicitud en un plazo máximo de 20 días hábiles, conforme a la normativa vigente.
          </p>
        </div>

        <div className="border-l-2 border-gold/20 pl-6 space-y-3">
          <h2 className="font-serif text-xl text-gold">Cambios en esta política</h2>
          <p className="font-sans text-cream/60 text-sm leading-relaxed">
            Podemos actualizar esta política ocasionalmente. La versión vigente estará siempre disponible
            en esta página con la fecha de última actualización indicada al inicio.
          </p>
        </div>

      </section>

      <Footer />
    </main>
  )
}

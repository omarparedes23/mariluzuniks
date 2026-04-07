import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ValoresStrip from '@/components/ValoresStrip'
import Servicios from '@/components/Servicios'
import Marcas from '@/components/Marcas'
import Galeria from '@/components/Galeria'
import Nosotros from '@/components/Nosotros'
import Testimonios from '@/components/Testimonios'
import Contacto from '@/components/Contacto'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ValoresStrip />
      <Servicios />
      <Marcas />
      <Galeria />
      <Nosotros />
      <Testimonios />
      <Contacto />
      <Footer />
    </main>
  )
}

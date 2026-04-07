interface SectionTitleProps {
  subtitle?: string
  title: string
  align?: 'left' | 'center'
}

export default function SectionTitle({
  subtitle,
  title,
  align = 'center',
}: SectionTitleProps) {
  const isCenter = align === 'center'

  return (
    <div className={`mb-14 ${isCenter ? 'text-center' : 'text-left'}`}>
      {subtitle && (
        <p className="font-sans text-gold text-xs tracking-[0.4em] uppercase mb-4">
          {subtitle}
        </p>
      )}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight">
        {title}
      </h2>
      <div
        className={`mt-5 h-px bg-gradient-to-r from-transparent via-gold to-transparent w-24 ${isCenter ? 'mx-auto' : ''}`}
      />
    </div>
  )
}

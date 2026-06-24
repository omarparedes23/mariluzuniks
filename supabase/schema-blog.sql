-- Blog posts para Unik's Salon Spa
CREATE TABLE IF NOT EXISTS uniks_blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo        TEXT NOT NULL,
  slug          TEXT NOT NULL,
  resumen       TEXT,
  contenido     TEXT NOT NULL,
  imagen_url    TEXT,
  publicado     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniks_blog_posts_slug_idx ON uniks_blog_posts(slug);

ALTER TABLE uniks_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts" ON uniks_blog_posts
  FOR SELECT USING (publicado = true);

CREATE POLICY "Authenticated full access blog" ON uniks_blog_posts
  TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_blog_updated_at
  BEFORE UPDATE ON uniks_blog_posts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Post de ejemplo
INSERT INTO uniks_blog_posts (titulo, slug, resumen, contenido, publicado)
VALUES (
  '5 consejos para mantener tu cabello hidratado en Lima',
  '5-consejos-cabello-hidratado-lima',
  'El clima de Lima puede ser agresivo con tu cabello. Te compartimos los secretos de nuestras estilistas para mantenerlo brillante y sano todo el año.',
  'Lima tiene una humedad particular que puede afectar tu cabello de maneras inesperadas. Ya sea que tengas el cabello liso, ondulado o rizado, la combinación de neblina y contaminación puede resecar las puntas y opacar el brillo natural.

Aquí te compartimos los 5 consejos que usamos a diario en Unik''s Salón & Spa:

1. Hidrata desde adentro
Beber al menos 8 vasos de agua al día es el paso más subestimado del cuidado capilar. El cabello refleja tu hidratación interna antes que cualquier producto lo haga.

2. Usa mascarilla una vez por semana
Una mascarilla nutritiva aplicada de medios a puntas, durante 15 minutos bajo una gorra de calor, puede transformar tu cabello en pocas semanas. En el salón trabajamos con ITALIAN MAX, una línea profesional que da resultados visibles desde la primera aplicación.

3. Sécalo con toalla de microfibra
Las toallas de algodón tradicionales rompen la cutícula del cabello. Una toalla de microfibra o incluso una camiseta de algodón suave reduce el frizz significativamente.

4. Aplica protector térmico siempre
Si usas secadora o plancha, el protector térmico no es opcional. El calor sin protección daña la queratina natural del cabello de manera acumulativa.

5. Corta las puntas cada 3 meses
Las puntas abiertas suben por el cabello y hacen que todo se vea opaco. Un corte de mantenimiento cada 3 meses mantiene el cabello con vida y brillo.

¿Quieres una consulta personalizada? Visítanos en Scarlatti 208, San Borja o escríbenos por WhatsApp para agendar tu cita.',
  true
);

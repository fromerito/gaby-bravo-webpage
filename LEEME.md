# Web de Gaby Bravo · cómo publicarla y mantenerla

## Qué hay en esta carpeta

| Archivo | Para qué |
| --- | --- |
| `index.html` | La web pública: servicios y precios, trabajos, reserva por WhatsApp, pagos, indicaciones, políticas, preguntas y ubicación. |
| `cotizar.html` | El cotizador de Gaby. No está enlazado desde la web y no aparece en Google. Guárdalo en la pantalla de inicio de su teléfono. |
| `c.html` | La página que abre la clienta al tocar el enlace de su cotización. |
| `datos.js` | **El único archivo que hay que editar**: precios, servicios, fotos de la galería, políticas, teléfono, dirección. |
| `cotizacion.js` | Lógica del enlace de cotización. No hace falta tocarlo. |
| `fotos/`, `img/`, `fonts/` | Fotos, logos y tipografías. Las fuentes van incluidas, así que la web no depende de Google Fonts. |

## Publicar (GitHub Pages, igual que Bellas)

1. Crea un repositorio, por ejemplo `gabybravoartist`, y sube todo el contenido de esta carpeta a la raíz.
2. En *Settings → Pages*, elige la rama `main` y la carpeta `/ (root)`.
3. Si tienes dominio propio, agrégalo ahí mismo y crea el registro CNAME en tu proveedor.
4. Abre `datos.js` y pon la dirección final en `sitio` (por ejemplo `https://gabybravoartist.com`). Los enlaces de cotización se arman con ella.

## Cambiar precios o servicios

Edita `datos.js` → `categorias`. Cada servicio tiene un `cod` (código corto). **No cambies el código de un servicio que ya usaste en cotizaciones enviadas**: el enlace guarda ese código. Para un servicio nuevo, inventa un código nuevo.

- `precio: null` muestra "Consultar".
- La categoría `Complementos` (`web: false`) solo aparece en el cotizador: domicilio, secado, recargo de madrugada.

## Agregar fotos

1. Exporta la foto en JPG o WebP de unos 1400 px de ancho y súbela a `fotos/`.
2. Agrégala en `datos.js` → `galeria` con su texto. `ancho: "doble"` la hace grande.
3. Para cambiar la foto de cada categoría de servicios, cambia `foto` en esa categoría. La foto de portada es `fotos/gaby-peinando.webp` (reemplaza el archivo con el mismo nombre).

Pendiente: hoy la web tiene solo 3 fotos reales. Las mejores candidatas están en la carpeta "Fotos" de OneDrive y en las cotizaciones de Canva (novias, retrato con blazer vino).

## Enlaces de cotización cortos (recomendado, 10 minutos)

Sin configurar nada, el cotizador genera un enlace largo (unos 170 caracteres) que funciona igual. Para que quede como `gabybravoartist.com/c.html#kAB12CD`:

1. En Supabase (puede ser el mismo proyecto de la Caja de Gabriela), abre *SQL Editor* y ejecuta:

```sql
create table if not exists public.cotizaciones (
  id text primary key,
  datos text not null check (length(datos) < 4000),
  creada timestamptz not null default now()
);
alter table public.cotizaciones enable row level security;

-- Cualquiera con la clave pública puede CREAR una cotización…
create policy "crear cotizaciones" on public.cotizaciones
  for insert to anon with check (true);
-- …pero nadie puede listarlas. Solo se lee una por su código exacto:
create or replace function public.ver_cotizacion(p_id text)
returns text language sql security definer set search_path = public as $$
  select datos from public.cotizaciones where id = p_id
$$;
grant execute on function public.ver_cotizacion(text) to anon;
```

2. Copia la *Project URL* y la *anon public key* (Settings → API) en `datos.js` → `acortador`.
3. Listo: el cotizador muestra el botón **Crear enlace corto** y luego **Enviar por WhatsApp**.

La clave anon es pública por diseño; con estas reglas solo permite crear cotizaciones y leer una cuando se conoce su código de 6 caracteres. No permite listar las de otras clientas.

## Cómo la usa Gaby (todos los días)

1. Abre `cotizar.html` desde el ícono en su teléfono.
2. Escribe el nombre de la clienta y, si quiere, su WhatsApp.
3. Toca los servicios (se suman solos; toca dos veces para 2 personas) y ajusta precios si hace falta.
4. Escribe el total en divisas si aplica.
5. Toca **Enviar por WhatsApp**: se abre el chat de la clienta con el mensaje y el enlace listos.

La clienta ve su cotización con la marca, el total, qué incluye cada servicio, cómo pagar y las políticas, y tiene un botón para reservar que le escribe a Gaby con el código de la cotización.

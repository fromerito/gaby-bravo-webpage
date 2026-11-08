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

## Enlaces cortos e historial (Supabase, ya configurado)

- Proyecto: `innaconhuyiyufxifhst` (datos en `datos.js` → `acortador`). La clave es la **publicable**: va en la web a propósito.
- Tabla `cotizaciones`: solo los usuarios con `app_metadata.rol = "cotiza"` (Gaby y Fernando) pueden crear, listar y borrar. Nadie más puede leer la lista.
- La clienta abre **una** cotización con su código de 8 caracteres mediante la función `ver_cotizacion`. No puede listar ni crear.
- Para dar acceso a otra persona: créale un usuario en *Authentication → Users* y ejecuta en el SQL Editor
  `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"rol":"cotiza"}' where email = 'correo@ejemplo.com';`
- **Pausa por inactividad:** el plan gratis pausa el proyecto tras 7 días sin uso y los enlaces cortos dejan de abrir. La tarea `.github/workflows/mantener-supabase.yml` hace una consulta diaria para evitarlo. Si alguna vez falla, GitHub te avisa por correo. Si el proyecto se pausa igual, reactívalo en el panel de Supabase (*Resume project*).
- Sin sesión, el cotizador sigue funcionando con enlaces largos, que no dependen de Supabase.

## Cómo la usa Gaby (todos los días)

1. Abre `cotizar.html` desde el ícono en su teléfono. La primera vez inicia sesión con su correo y contraseña de Supabase; después queda dentro.
2. Escribe el nombre de la clienta y, si quiere, su WhatsApp.
3. Toca los servicios (se suman solos; toca dos veces para 2 personas) y ajusta precios si hace falta.
4. Escribe el total en divisas si aplica.
5. Toca **Crear enlace corto** y luego **Enviar por WhatsApp**: se abre el chat de la clienta con el mensaje y el enlace listos.
6. Para encontrar una cotización vieja: sección **Historial**, busca por nombre o folio (GB-…). Desde ahí puede abrirla, reenviarla o usarla de base para una nueva.

La clienta ve su cotización con la marca, el total, qué incluye cada servicio, cómo pagar y las políticas, y tiene un botón para reservar que le escribe a Gaby con el código de la cotización.

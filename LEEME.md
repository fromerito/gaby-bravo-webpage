# Web de Gaby Bravo · cómo publicarla y mantenerla

## Qué hay en esta carpeta

| Archivo | Para qué |
| --- | --- |
| `index.html` | Portada: promo, tarjetas de categorías, galería, pagos, políticas y contacto. |
| `novias.html`, `quinceaneras.html`, `eventos.html`, `cursos.html` | Una página por categoría, con sus servicios, precios y botón **Agregar**. Sirven de destino para los anuncios. |
| `reservar.html` | **Mi reserva**: la clienta revisa lo que eligió, pone fecha, lugar (con mapa) y nombre, y se abre WhatsApp con el detalle, los totales, el descuento y el abono. |
| `cotizar.html` | El cotizador de Gaby (no enlazado ni indexado). |
| `c.html` | La cotización que abre la clienta. |
| `datos.js` | **El único archivo que hay que editar**: precios, servicios, promo, fotos, políticas, teléfono, dirección. |
| `estilos.css`, `sitio.js`, `inicio.js`, `categoria.js`, `reservar.js`, `cotizacion.js` | Estilos y lógica. No hace falta tocarlos. |
| `fotos/`, `fotos/sm/`, `img/`, `fonts/` | Fotos (`sm` = versión liviana para teléfonos), logos y tipografías. |

## Promoción

En `datos.js` → `promo`:
- `activa`, `porcentaje`, `desde`, `hasta`: la promo aparece sola en esas fechas (hora de Venezuela) y desaparece al día siguiente de `hasta`. Para apagarla antes: `activa: false`.
- `codigo`: viaja en el mensaje de WhatsApp para que Gaby reconozca las reservas de la web.
- `eventoDesde`, `eventoHasta`: el descuento solo se aplica si la **fecha del evento** que elige la clienta cae en ese rango.
- El porcentaje se descuenta del **total en conjunto** (no servicio por servicio). Los precios de cada servicio se muestran siempre a precio de lista; el descuento aparece en Mi reserva al elegir una fecha válida.
- `cinta`, `condiciones`: textos que ve la clienta.

## Peinados para acompañantes (mamá, cortejo)

En `datos.js`, bloque `acompanantes`: cuando la clienta agrega **Peinado de novia** o **Peinado de quinceañera**, aparece justo debajo una oferta de "Peinado para mamá o cortejo" con `porcentaje` de descuento (5%) sobre el precio del servicio `base` (Peinado social). Si después quita su peinado de novia o quinceañera, esos peinados pasan solos a Peinado social a precio normal. Para apagar la oferta: `activa: false`.

## Anuncios

Enlaza cada anuncio a su página y agrega etiquetas UTM, por ejemplo:
`https://gabybravoartist.com/novias.html?utm_source=instagram&utm_campaign=promo-noviembre`
El mensaje que llega a Gaby termina con "Te encontré por: instagram (promo-noviembre)". Así se cuentan las reservas de cada anuncio.

## Dirección

- Web: **https://gabybravoartist.com** (dominio en Cloudflare Registrar, a nombre de Gabriela Bravo).
- DNS en Cloudflare, todos en "Solo DNS" (nube gris): 4 registros A de `@` a 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 y un CNAME `www` → `fromerito.github.io`.
- El archivo `CNAME` de esta carpeta le dice a GitHub Pages cuál es el dominio. No lo borres.
- Supabase (Authentication → URL Configuration): Site URL `https://gabybravoartist.com/cotizar.html`.

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

## Cambiar la estructura de las páginas

Las páginas (`index.html`, `novias.html`… `reservar.html`) se arman con `python3 _fuente/build.py` a partir de las plantillas de `_fuente/src/` (cabecera, pie y el contenido de cada página). Solo hace falta para cambiar la estructura. Para precios, servicios, textos, fotos o la promo, basta con `datos.js`. La carpeta `_fuente/` no se publica en la web.

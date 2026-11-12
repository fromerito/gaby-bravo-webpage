"""Arma la web (uso: python3 _fuente/build.py desde la raíz del repo; requiere Node para leer datos.js): une cabecera + contenido + pie de cada página y copia los archivos.
   Uso: python3 build.py   →  carpeta deploy/ lista para subir.
   Los precios y textos NO se fijan aquí: cada página los lee de datos.js al abrirse."""
import shutil, os, json, subprocess, re
# Versión para el repo: este archivo vive en _fuente/ y escribe las páginas en la raíz del repo.
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')
V = '20261111a'   # súbelo cuando cambies estilos o JS, para que los teléfonos no usen la versión vieja
SITIO = 'https://gabybravoartist.com'
G = json.loads(subprocess.check_output(['node', '-e', 'global.window={};require("./datos.js");process.stdout.write(JSON.stringify(window.GB))'], cwd=R))
src = lambda f: open(f'{SRC}/{f}').read()
CAB, PIE = src('_cabecera.html'), src('_pie.html')
LDJSON = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"BeautySalon","name":"Gaby Bravo","description":"Maquilladora profesional y especialista en peinado","telephone":"+58 424-8454819","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"C. C. Costanera, Plaza 1, piso 3, local P3-02, Av. El Ejército","addressLocality":"Barcelona","addressRegion":"Anzoátegui","addressCountry":"VE"},"geo":{"@type":"GeoCoordinates","latitude":10.16093,"longitude":-64.69238},"areaServed":["Barcelona","Lechería","Puerto La Cruz"],"sameAs":["https://instagram.com/gabybravoartist"]}</script>'''

def head(titulo, desc, ruta, img, extra=''):
    url = f'{SITIO}/{ruta}'
    return f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITIO}/{img}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<link rel="canonical" href="{url}">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32.png">
<link rel="apple-touch-icon" href="img/icono-180.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#F5EBE1">
<meta name="apple-mobile-web-app-title" content="Gaby Bravo">
<link rel="preload" href="fonts/bodoni-moda-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="estilos.css?v={V}">
{extra}</head>
'''

def pagina(nombre, titulo, desc, img, cuerpo, js, cat='', bolsa=('0', 'reservar.html', 'Continuar'), extra=''):
    pie = PIE.replace('{{BOLSA_SIEMPRE}}', bolsa[0]).replace('{{BOLSA_HREF}}', bolsa[1]).replace('{{BOLSA_BTN}}', bolsa[2])
    if nombre == 'reservar': pie = pie.split('<div class="bolsa')[0]
    ruta = '' if nombre == 'index' else f'{nombre}.html'
    return (head(titulo, desc, ruta, img, extra) + f'<body data-pagina="{nombre}"' + (f' data-cat="{cat}"' if cat else '') + '>\n'
            + CAB + cuerpo + pie
            + f'<script src="datos.js?v={V}"></script>\n<script src="sitio.js?v={V}"></script>\n<script src="{js}?v={V}"></script>\n</body>\n</html>\n')

paginas = {'index': pagina('index', 'Gaby Bravo · Peinado y maquillaje en Barcelona y Lechería',
                           'Maquilladora profesional y especialista en peinado. Novias, quinceañeras y eventos, en el estudio o a domicilio. Reserva desde la web.',
                           'img/og.jpg', src('inicio.html'), 'inicio.js', bolsa=('1', '#servicios', 'Ver servicios'), extra=LDJSON + '\n')}
for c in G['categorias']:
    if c.get('web') is False or not c.get('pagina'): continue
    nombre = c['pagina'][:-5]
    cuerpo = (src('categoria.html').replace('{{PORTADA}}', c.get('portada') or c['foto']).replace('{{PORTADA_ALT}}', c.get('fotoAlt', ''))
              .replace('{{NOMBRE}}', c['nombre']).replace('{{SCRIPT}}', c['script']).replace('{{TITULO2}}', c.get('titulo2') or c['nombre']))
    paginas[nombre] = pagina(nombre, f"{c['nombre']} · Gaby Bravo", c.get('intro', ''), c.get('portada') or c['foto'], cuerpo, 'categoria.js', cat=c['id'],
                             extra=f'<link rel="preload" as="image" href="{c.get("portada") or c["foto"]}">\n')
paginas['reservar'] = pagina('reservar', 'Mi reserva · Gaby Bravo', 'Revisa tus servicios, elige fecha y lugar, y envía tu reserva por WhatsApp.',
                             'img/og.jpg', src('reservar.html'), 'reservar.js', extra='<meta name="robots" content="noindex">\n')

# Versión de los scripts en el cotizador y la cotización de la clienta
for f in ['c.html', 'cotizar.html']:
    t = open(f'{R}/{f}').read(); open(f'{R}/{f}', 'w').write(re.sub(r'\?v=\d{8}[a-z]?"', f'?v={V}"', t))

for n, html in paginas.items(): open(f'{R}/{n}.html', 'w').write(html)
print('ok:', ', '.join(f'{n}.html' for n in paginas))

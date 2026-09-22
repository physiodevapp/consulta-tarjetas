# Genera lo que publica GitHub Pages: index.html (junta los cinco <región>.data.json
# e inyecta el resultado en plantilla.html, con el selector de región al entrar),
# manifest.webmanifest y service-worker.js (tarea 5: uso sin conexión).
import hashlib, json, os

aqui = os.path.dirname(os.path.abspath(__file__))
# tools/ está un nivel por debajo de la raíz del repo: app.json y los tres archivos
# generados (index.html, manifest.webmanifest, service-worker.js) viven en la raíz,
# porque GitHub Pages publica desde ahí (sin GitHub Actions, ver CLAUDE.md).
raiz = os.path.dirname(aqui)
dir_src = os.path.join(raiz, 'src')
dir_data = os.path.join(raiz, 'data')

# Nombre de la app: una sola constante (app.json, decisión 9). De ahí salen el título de
# la pestaña, la cabecera del inicio, package.json y el manifest.
nombre_app = json.load(open(os.path.join(raiz, 'app.json'), encoding='utf-8'))['nombre']
nombre_corto = nombre_app.split(' ')[0]

# Las regiones de la SPA (ver CLAUDE.md); las cinco de la tarea 4 más tobillo y pie.
# El orden es el del selector del inicio (decisión propia, no viene de ninguna guía).
REGIONES = ['cervical', 'lumbar', 'hombro', 'cadera', 'rodilla', 'tobillo_pie']

datos_por_region = {}
for r in REGIONES:
    archivo = os.path.join(dir_data, f'{r}.data.json')
    if os.path.exists(archivo):
        datos_por_region[r] = json.load(open(archivo, encoding='utf-8'))

# Metadatos para el selector del inicio: las que no tienen datos todavía se ven
# pero no se pueden abrir (disponible: false). 'caras' (qué caras trae el docx de esa
# región, ver tools/datos.js) solo la usa la pantalla «Documentos», para el subtítulo
# de cada tarjeta descargable.
regiones = [{
    'region': r,
    'nombre': datos_por_region[r]['NOMBRE'] if r in datos_por_region else r.capitalize(),
    'disponible': r in datos_por_region,
    'caras': datos_por_region[r]['CARAS'] if r in datos_por_region else []
} for r in REGIONES]

bundle = {'APP': nombre_app, 'REGIONES': regiones, 'DATOS': datos_por_region}
data_json = json.dumps(bundle, ensure_ascii=False).replace('</', '<\\/')
html = open(os.path.join(dir_src, 'plantilla.html'), encoding='utf-8').read()
assert '__APP__' in html
html = html.replace('__APP__', nombre_app)
assert '__DATA__' in html
html = html.replace('__DATA__', data_json)
assert '__DATA__' not in html
salida = os.path.join(raiz, 'index.html')
open(salida, 'w', encoding='utf-8').write(html)
print('ok', salida, len(html), 'bytes')

# manifest.webmanifest: mismo nombre que la pestaña y la cabecera (decisión 9)
manifest = open(os.path.join(dir_src, 'plantilla-manifest.webmanifest'), encoding='utf-8').read()
assert '__APP__' in manifest and '__APP_CORTO__' in manifest
manifest = manifest.replace('__APP__', nombre_app).replace('__APP_CORTO__', nombre_corto)
json.loads(manifest)  # valida que sigue siendo JSON después de sustituir
salida_manifest = os.path.join(raiz, 'manifest.webmanifest')
open(salida_manifest, 'w', encoding='utf-8').write(manifest)
print('ok', salida_manifest, len(manifest), 'bytes')

# service-worker.js: la caché lleva un hash corto de index.html, así que cambiar el
# contenido (cualquier región, o la propia plantilla) invalida la caché sola
cache_id = hashlib.sha256(html.encode('utf-8')).hexdigest()[:10]
sw = open(os.path.join(dir_src, 'plantilla-sw.js'), encoding='utf-8').read()
assert '__CACHE__' in sw
sw = sw.replace('__CACHE__', cache_id)
salida_sw = os.path.join(raiz, 'service-worker.js')
open(salida_sw, 'w', encoding='utf-8').write(sw)
print('ok', salida_sw, len(sw), 'bytes')

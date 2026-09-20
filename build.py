# Genera lo que publica GitHub Pages: index.html (junta los cinco <región>.data.json
# e inyecta el resultado en plantilla.html, con el selector de región al entrar),
# manifest.webmanifest y service-worker.js (tarea 5: uso sin conexión).
import hashlib, json, os

aqui = os.path.dirname(os.path.abspath(__file__))
# Nombre de la app: una sola constante (app.json, decisión 9). De ahí salen el título de
# la pestaña, la cabecera del inicio, package.json y el manifest.
nombre_app = json.load(open(os.path.join(aqui, 'app.json'), encoding='utf-8'))['nombre']
nombre_corto = nombre_app.split(' ')[0]

# Las cinco regiones de la SPA (ver CLAUDE.md); todas con datos desde la tarea 4.
REGIONES = ['hombro', 'lumbar', 'cervical', 'cadera', 'rodilla']

datos_por_region = {}
for r in REGIONES:
    archivo = os.path.join(aqui, f'{r}.data.json')
    if os.path.exists(archivo):
        datos_por_region[r] = json.load(open(archivo, encoding='utf-8'))

# Metadatos para el selector del inicio: las que no tienen datos todavía se ven
# pero no se pueden abrir (disponible: false).
regiones = [{
    'region': r,
    'nombre': datos_por_region[r]['NOMBRE'] if r in datos_por_region else r.capitalize(),
    'disponible': r in datos_por_region
} for r in REGIONES]

bundle = {'APP': nombre_app, 'REGIONES': regiones, 'DATOS': datos_por_region}
data = json.dumps(bundle, ensure_ascii=False).replace('</', '<\\/')
html = open(os.path.join(aqui, 'plantilla.html'), encoding='utf-8').read()
assert '__APP__' in html
html = html.replace('__APP__', nombre_app)
assert '__DATA__' in html
html = html.replace('__DATA__', data)
assert '__DATA__' not in html
salida = os.path.join(aqui, 'index.html')
open(salida, 'w', encoding='utf-8').write(html)
print('ok', salida, len(html), 'bytes')

# manifest.webmanifest: mismo nombre que la pestaña y la cabecera (decisión 9)
manifest = open(os.path.join(aqui, 'plantilla-manifest.webmanifest'), encoding='utf-8').read()
assert '__APP__' in manifest and '__APP_CORTO__' in manifest
manifest = manifest.replace('__APP__', nombre_app).replace('__APP_CORTO__', nombre_corto)
json.loads(manifest)  # valida que sigue siendo JSON después de sustituir
salida_manifest = os.path.join(aqui, 'manifest.webmanifest')
open(salida_manifest, 'w', encoding='utf-8').write(manifest)
print('ok', salida_manifest, len(manifest), 'bytes')

# service-worker.js: la caché lleva un hash corto de index.html, así que cambiar el
# contenido (cualquier región, o la propia plantilla) invalida la caché sola
cache_id = hashlib.sha256(html.encode('utf-8')).hexdigest()[:10]
sw = open(os.path.join(aqui, 'plantilla-sw.js'), encoding='utf-8').read()
assert '__CACHE__' in sw
sw = sw.replace('__CACHE__', cache_id)
salida_sw = os.path.join(aqui, 'service-worker.js')
open(salida_sw, 'w', encoding='utf-8').write(sw)
print('ok', salida_sw, len(sw), 'bytes')

# Junta los <región>.data.json disponibles e inyecta el resultado en plantilla.html
# para generar index.html (lo que publica GitHub Pages): una sola URL con un selector
# de región al entrar (tarea 3). Hoy solo hombro.data.json existe.
import json, os

aqui = os.path.dirname(os.path.abspath(__file__))
# Nombre de la app: una sola constante (app.json). De ahí salen el título de la
# pestaña, la cabecera del inicio, package.json y (task 5) el manifest.
nombre_app = json.load(open(os.path.join(aqui, 'app.json'), encoding='utf-8'))['nombre']

# Las cinco regiones de la SPA (ver CLAUDE.md); el resto se añade con la tarea 4.
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

# Inyecta hombro.data.json en plantilla.html y genera index.html (lo que publica GitHub Pages)
import json, os
aqui = os.path.dirname(os.path.abspath(__file__))
datos = json.load(open(os.path.join(aqui, 'hombro.data.json'), encoding='utf-8'))
data = json.dumps(datos, ensure_ascii=False).replace('</', '<\\/')
html = open(os.path.join(aqui, 'plantilla.html'), encoding='utf-8').read()
# el titulo sale del propio JSON; el color es una sola paleta fija para todas las regiones (en el CSS)
marca, valor = '__TITULO__', 'Consulta ' + datos['REGION']
assert marca in html, marca
html = html.replace(marca, valor)
html = html.replace('__DATA__', data)
assert '__DATA__' not in html
salida = os.path.join(aqui, 'index.html')
open(salida, 'w', encoding='utf-8').write(html)
print('ok', salida, len(html), 'bytes')

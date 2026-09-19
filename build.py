# Inyecta hombro.data.json en plantilla.html y genera index.html (lo que publica GitHub Pages)
import json, os
aqui = os.path.dirname(os.path.abspath(__file__))
datos = json.load(open(os.path.join(aqui, 'hombro.data.json'), encoding='utf-8'))
data = json.dumps(datos, ensure_ascii=False).replace('</', '<\\/')
html = open(os.path.join(aqui, 'plantilla.html'), encoding='utf-8').read()
# lo de la region sale del propio JSON: titulo y color de acento (claro y aclarado para tema oscuro)
for marca, valor in (('__TITULO__', 'Consulta ' + datos['REGION']),
                     ('__ACENTO_CLARO__', datos['ACENTO']['claro']),
                     ('__ACENTO_OSCURO__', datos['ACENTO']['oscuro'])):
    assert marca in html, marca
    html = html.replace(marca, valor)
html = html.replace('__DATA__', data)
assert '__DATA__' not in html
salida = os.path.join(aqui, 'index.html')
open(salida, 'w', encoding='utf-8').write(html)
print('ok', salida, len(html), 'bytes')

# Extrae el CONTENIDO de tarjeta_hombro.docx con la misma forma que consume plantilla_tarjetas.js
import docx, json, re, sys
from docx.oxml.ns import qn

SRC = sys.argv[1]
d = docx.Document(SRC)
els = []
for el in d.element.body.iterchildren():
    if el.tag == qn('w:p'):
        els.append(('p', docx.text.paragraph.Paragraph(el, d).text))
    elif el.tag == qn('w:tbl'):
        t = docx.table.Table(el, d)
        els.append(('t', [[c.text for c in r.cells] for r in t.rows]))

def sin_num(txt):
    # quita "BLOQUE N ·" del titulo; la plantilla lo pone aparte
    return re.sub(r'^\s*BLOQUE\s*[\d ]+(Y\s*\d+)?\s*·\s*', '', txt, flags=re.I).strip()

P = [e[1] for e in els if e[0] == 'p']
T = [e[1] for e in els if e[0] == 't']
assert len(T) == 5, len(T)

banderas_t, arbol_t, sind_t, orient_t, pron_t = T
bis = P[4].split('\n')
assert len(bis) == 3, bis

data = {
  'TITULOS': {'caraA': P[0], 'caraB': P[7], 'pieA2': P[6]},
  'BANDERAS': {'titulo': sin_num(P[1]), 'cabecera': banderas_t[0], 'filas': banderas_t[1:], 'nota': P[2]},
  'BISAGRA': {'pregunta': bis[0], 'ramas': bis[1], 'apoyo': bis[2]},
  'ARBOL': {'filas': arbol_t},
  'SINDROMES': {'aviso': P[8], 'cabecera': sind_t[0], 'filas': sind_t[1:], 'nota': P[10]},
  'ORIENTATIVA': {'titulo': sin_num(P[11]), 'cabecera': orient_t[0], 'filas': orient_t[1:], 'nota': P[12]},
  'PRONOSTICO': {'titulo': sin_num(P[13]), 'cabecera': pron_t[0], 'filas': pron_t[1:], 'nota': P[14], 'pie': P[15]},
}
# comprobaciones de forma
assert len(data['BANDERAS']['filas']) == 5
assert len(data['SINDROMES']['filas']) == 6
assert len(data['ORIENTATIVA']['filas']) == 7
assert len(data['PRONOSTICO']['filas']) == 6
assert all(len(f) == 4 for f in data['SINDROMES']['filas'])
json.dump(data, open('hombro.data.json', 'w'), ensure_ascii=False, indent=1)
print('ok')
for k in ('SINDROMES','ORIENTATIVA','PRONOSTICO'):
    print(k, [f[0] for f in data[k]['filas']])
print('ARBOL n:', [f[0] for f in data['ARBOL']['filas']])
print('BISAGRA:', data['BISAGRA'])
print('pron nota:', data['PRONOSTICO']['nota'])
print('sind aviso:', data['SINDROMES']['aviso'])
print('orient titulo:', data['ORIENTATIVA']['titulo'], '| pron titulo:', data['PRONOSTICO']['titulo'], '| band titulo:', data['BANDERAS']['titulo'])

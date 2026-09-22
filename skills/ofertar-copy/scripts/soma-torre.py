#!/usr/bin/env python3
"""Confere a conta da torre de oferta no HTML publicado.

Lê os valores de cada item (produto e bônus), soma, e compara com o "de"
riscado, o "por" e a linha "você economiza". Roda depois de qualquer troca
de preço: numa sessão real o preço mudou três vezes em uma tarde, e a soma
na mão erra.

Uso:
    python3 soma-torre.py index.html
    python3 soma-torre.py index.html --preco 137

Procura os valores em elementos com classe "valor" (itens), "de" e "por"
(fecho) e um "economiza <strong>R$ N</strong>". Se a sua torre usa outras
classes, passe --sel-item, --sel-de, --sel-por.
"""
import re, sys, argparse

def reais(txt):
    m = re.search(r'R\$\s*([\d.]+)(?:,(\d{2}))?', txt)
    if not m: return None
    return float(m.group(1).replace('.', '')) + (float('0.' + m.group(2)) if m.group(2) else 0)

def entre(html, classe):
    return [re.sub(r'<[^>]+>', '', x) for x in re.findall(r'class="[^"]*\b%s\b[^"]*"[^>]*>(.*?)</' % classe, html, re.S)]

ap = argparse.ArgumentParser()
ap.add_argument('html'); ap.add_argument('--preco', type=float)
ap.add_argument('--sel-item', default='valor'); ap.add_argument('--sel-de', default='de'); ap.add_argument('--sel-por', default='por')
a = ap.parse_args()
h = open(a.html, encoding='utf-8').read()

itens = [reais(t) for t in entre(h, a.sel_item)]
itens = [v for v in itens if v is not None]
de = next((reais(t) for t in entre(h, a.sel_de) if reais(t)), None)
por = a.preco or next((reais(t) for t in entre(h, a.sel_por) if reais(t)), None)
eco = reais(re.search(r'economiza.*?</strong>', h, re.S | re.I).group(0)) if re.search(r'economiza', h, re.I) else None

soma = sum(itens)
print(f'itens ({len(itens)}): ' + ' + '.join(f'{v:.0f}' for v in itens) + f' = R$ {soma:.0f}')
print(f'"de" riscado no fecho: R$ {de:.0f}' if de else '"de" não encontrado')
print(f'preço "por": R$ {por:.0f}' if por else 'preço "por" não encontrado')
print(f'economia escrita: R$ {eco:.0f}' if eco else 'economia não encontrada')
erros = []
if de is not None and abs(de - soma) > 0.5: erros.append(f'o "de" (R$ {de:.0f}) não bate com a soma dos itens (R$ {soma:.0f})')
if de is not None and por is not None and eco is not None and abs((de - por) - eco) > 0.5:
    erros.append(f'a economia escrita (R$ {eco:.0f}) não bate com {de:.0f} - {por:.0f} = R$ {de - por:.0f}')
print('\nOK: a torre fecha.' if not erros else '\nERRO:\n- ' + '\n- '.join(erros))
sys.exit(1 if erros else 0)

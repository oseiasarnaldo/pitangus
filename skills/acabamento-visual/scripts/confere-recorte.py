#!/usr/bin/env python3
"""Confere recorte de pessoa ANTES de ir pra página.

Uso:  python3 confere-recorte.py recorte.png [outro.webp ...]

Rode no recorte com o canvas original (antes de cortar no contorno). Ele
responde duas perguntas:

1. Algum membro encosta na borda lateral ou de cima?  Se sim, a foto de
   origem já vinha cortada e o recorte herdou o corte: braço ou ombro vão
   terminar retos na página. A base (borda de baixo) é permitida, porque o
   fade da página cuida dela.
2. Quanto do corpo está semitransparente?  Recorte bom é opaco por dentro e
   macio só no contorno. Miolo semitransparente é fantasma de origem: o fundo
   da página vai aparecer através da pessoa.

Também salva <nome>-magenta.jpg ao lado, com a pessoa sobre magenta, que é
onde furo e borda cinza aparecem. Abra e olhe.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

BORDA_PX = 3          # faixa da borda que conta como "encostou"
MINIMO_NA_BORDA = 12  # pixels opacos na faixa pra acusar (ignora poeira)


def confere(caminho):
    im = Image.open(caminho).convert("RGBA")
    a = np.asarray(im)[..., 3].astype(np.float32) / 255
    h, w = a.shape
    opaco = a > 0.9

    encostos = []
    faixas = {
        "esquerda": opaco[:, :BORDA_PX],
        "direita": opaco[:, -BORDA_PX:],
        "topo": opaco[:BORDA_PX, :],
    }
    for lado, faixa in faixas.items():
        n = int(faixa.sum())
        if n >= MINIMO_NA_BORDA:
            encostos.append(f"{lado} ({n} px)")

    # miolo: pessoa erodida, longe do contorno, onde tudo devia ser opaco
    mascara = Image.fromarray(((a > 0.5) * 255).astype(np.uint8))
    miolo = np.asarray(mascara.filter(ImageFilter.MinFilter(15))) > 0
    semi = ((a > 0.05) & (a < 0.9) & miolo).sum() / max(miolo.sum(), 1)

    fundo = Image.new("RGBA", im.size, (255, 0, 255, 255))
    fundo.alpha_composite(im)
    saida = Path(caminho).with_name(Path(caminho).stem + "-magenta.jpg")
    fundo.convert("RGB").save(saida, quality=85)

    ok = not encostos and semi < 0.01
    print(f"\n{caminho}  ({w}x{h})")
    print(f"  membro na borda:     {'NÃO' if not encostos else 'SIM: ' + ', '.join(encostos)}")
    print(f"  miolo semitransp.:   {semi * 100:.2f}%  {'ok' if semi < 0.01 else 'FANTASMA DE ORIGEM'}")
    print(f"  prévia sobre magenta: {saida}")
    if encostos:
        print("  -> reconstrua pedindo 'zoom out, 15% de margem' e o membro cortado pelo nome")
    if semi >= 0.01:
        print("  -> recorte de novo (isnet-general-use) ou limpe o alfa: miolo opaco, contorno macio")
    print(f"  veredito: {'APROVADO' if ok else 'REPROVADO'}")
    return ok


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    resultados = [confere(c) for c in sys.argv[1:]]
    sys.exit(0 if all(resultados) else 2)

# Calculadora de Taxa Basal (TMB)

Calculadora de **taxa metabólica basal** e **gasto calórico diário** feita com **HTML, CSS e JavaScript puro**, sem bibliotecas. É a companheira da [Calculadora de IMC](https://github.com/Nidragnnar/IMC).

🔗 **Usar online:** https://nidragnnar.github.io/TMB/ (depois de ativar o GitHub Pages, veja abaixo)

## Recursos

- **Taxa metabólica basal (TMB):** calorias que o corpo gasta por dia em repouso total
- **Gasto calórico diário (GET):** a TMB ajustada pelo nível de atividade física
- **Metas de referência** para perder, manter ou ganhar peso
- Comparação com a fórmula de Harris-Benedict
- Aviso quando a meta de perda fica abaixo da TMB
- Calcula enquanto você digita
- Aceita **vírgula ou ponto** e altura em **centímetros ou metros** (`175` ou `1,75`)
- Validação com mensagens claras
- Tema claro e escuro automático (segue o sistema)
- Layout responsivo e acessível

## Como é calculado

**Mifflin-St Jeor** (fórmula principal), com peso em kg, altura em cm e idade em anos:

```
Homens:   TMB = 10 × peso + 6,25 × altura − 5 × idade + 5
Mulheres: TMB = 10 × peso + 6,25 × altura − 5 × idade − 161
```

**Harris-Benedict revisada** (Roza e Shizgal, 1984), mostrada para comparação:

```
Homens:   TMB = 88,362 + 13,397 × peso + 4,799 × altura − 5,677 × idade
Mulheres: TMB = 447,593 + 9,247 × peso + 3,098 × altura − 4,330 × idade
```

**Gasto calórico diário** = TMB × fator de atividade:

| Nível de atividade | Fator |
| --- | --- |
| Sedentário | 1,2 |
| Levemente ativo | 1,375 |
| Moderadamente ativo | 1,55 |
| Muito ativo | 1,725 |
| Extremamente ativo | 1,9 |

**Metas de referência:**

| Meta | Cálculo |
| --- | --- |
| Perder peso | gasto diário − 500 kcal (cerca de 0,5 kg por semana) |
| Manter o peso | gasto diário |
| Ganhar peso | gasto diário + 300 kcal |

> ⚠️ Os valores são estimativas e não substituem a orientação de um nutricionista ou médico.

## Estrutura

```
TMB/
├── index.html
├── style.css
└── script.js
```

## Como rodar

Não precisa instalar nada: basta abrir o `index.html` no navegador.

## Publicar no GitHub Pages

No repositório, vá em **Settings → Pages**, selecione a branch `main` e a pasta `/ (root)` e salve.

# Casa São Nuno — Guest Guide Digital

Guia digital do hóspede da **Casa São Nuno, Fátima**. Website estático, em 8 idiomas, instalável no telemóvel (PWA), que funciona offline e está pronto para o **GitHub Pages** (alojamento gratuito).

> **Conceito visual:** *Spiritual Luxury — Faith, Peace & Hospitality*
> Marfim, champanhe, dourado suave e azul celestial · títulos em *Cormorant Garamond* · texto em *Jost*.

---

## Índice

1. [O que está incluído](#1-o-que-está-incluído)
2. [Estrutura dos ficheiros](#2-estrutura-dos-ficheiros)
3. [Publicar no GitHub Pages (passo a passo)](#3-publicar-no-github-pages-passo-a-passo)
4. [Criar o QR Code definitivo](#4-criar-o-qr-code-definitivo)
5. [Atualizar o website no futuro](#5-atualizar-o-website-no-futuro)
6. [Fotografias: o que é real e o que é ilustrativo](#6-fotografias-o-que-é-real-e-o-que-é-ilustrativo)
7. [Como funcionam os idiomas](#7-como-funcionam-os-idiomas)
8. [Funcionamento offline e instalação (PWA)](#8-funcionamento-offline-e-instalação-pwa)
9. [Testes realizados](#9-testes-realizados)
10. [Resolução de problemas](#10-resolução-de-problemas)

---

## 1. O que está incluído

| Secção | Conteúdo |
|---|---|
| **Página inicial** | Logótipo, fotografia de Fátima tirada do hotel, "Welcome to Casa São Nuno" / "Your stay, our hospitality.", botão para explorar o guia, atalhos rápidos (check-in, check-out, Wi-Fi) |
| **Boas-vindas** | Mensagem de boas-vindas com fotografia real da receção |
| **Check-in & Check-out** | Check-in a partir das 18:00 · Check-out até às 12:00 · Grupos até às 11:00 · Depósito de bagagem junto à receção |
| **Restaurante e Refeições** | Pequeno-almoço 08:00–10:30 (rés-do-chão) · Almoço 12:30–15:00 (1.º andar) · Jantar 19:00–21:00 (1.º andar) · Aviso dos últimos 30 minutos |
| **Wi-Fi** | Rede "Casa São Nuno", password 12345678, botão **Copiar password** com confirmação |
| **Bar** | 1.º andar, junto ao restaurante · 16:00–00:00 · fotografias reais do bar |
| **Regras do Hotel** | Proibido fumar · Silêncio após as 23:00 |
| **Onde Comer** | Restaurante D. Duarte, com botões **Ver no Google Maps** e **Obter direções** |
| **Locais a Visitar** | Aljustrel, a terra dos três pastorinhos, com botões do Google Maps |

Inclui ainda o seletor de 8 idiomas, um menu adaptado ao telemóvel, um botão para voltar ao início, animações suaves e a instalação como aplicação.

**Não foram inventados** horários, preços, menus, contactos nem moradas que não tenham sido fornecidos.

---

## 2. Estrutura dos ficheiros

```
casa-sao-nuno-guest-guide/
├── index.html              ← página do guia
├── styles.css              ← design (cores, tipografia, layout)
├── script.js               ← idiomas, menu, cópia do Wi-Fi, instalação
├── manifest.json           ← definições da aplicação (PWA)
├── service-worker.js       ← funcionamento offline
├── offline.html            ← página mostrada sem internet (raramente necessária)
├── .nojekyll               ← indica ao GitHub para publicar os ficheiros tal como estão
├── assets/
│   ├── images/             ← fotografias e ilustrações
│   ├── icons/              ← ícones da aplicação e favicon
│   ├── fonts/              ← tipos de letra (alojados localmente, funcionam offline)
│   └── js/qrcode-generator.js  ← biblioteca de QR Code (licença MIT)
├── translations/           ← textos dos 8 idiomas
│   ├── pt.json  en.json  fr.json  pl.json
│   └── it.json  es.json  de.json  ko.json
├── qr-code/
│   └── index.html          ← gerador de QR Code + cartão para imprimir (uso interno)
├── tools/
│   └── generate-qr.js      ← gera qrcode.png e qrcode.svg (opcional, para técnicos)
└── README.md
```

---

## 3. Publicar no GitHub Pages (passo a passo)

Não precisa de saber programar. Só precisa de um navegador (Chrome, Safari, Edge…).

### Passo 1 — Criar uma conta GitHub (gratuita)

1. Aceda a **https://github.com** e clique em **Sign up**.
2. Escolha um **nome de utilizador** com cuidado: vai fazer parte do endereço do guia e **não deve ser alterado no futuro** (se mudar, o QR Code deixa de funcionar).
   Exemplo: `casasaonuno` → o guia ficará em `https://casasaonuno.github.io/…`
3. Confirme o email.

### Passo 2 — Criar o repositório (a "pasta" do projeto)

1. Com a sessão iniciada, clique no **+** (canto superior direito) → **New repository**.
2. Em **Repository name**, escreva: `guest-guide`
3. Selecione **Public** (obrigatório para o GitHub Pages gratuito).
4. Clique em **Create repository**.

> O endereço final será: `https://NOME-DE-UTILIZADOR.github.io/guest-guide/`

### Passo 3 — Carregar os ficheiros

1. Na página do repositório acabado de criar, clique na ligação **uploading an existing file**
   (ou em **Add file → Upload files**).
2. Abra no computador a pasta `casa-sao-nuno-guest-guide` e **selecione todo o conteúdo de dentro da pasta** (não a pasta em si): `index.html`, `styles.css`, `script.js`, `manifest.json`, `service-worker.js`, `offline.html`, `README.md` e as pastas `assets`, `translations`, `qr-code` e `tools`.
3. **Arraste** tudo para a janela do GitHub. As pastas são carregadas com o seu conteúdo.
4. Aguarde até todos os ficheiros aparecerem na lista. No fim da página, clique em **Commit changes**.

> Confirme que o ficheiro `index.html` aparece **diretamente** na página inicial do repositório (e não dentro de outra pasta).
> O ficheiro `.nojekyll` é opcional: se o computador o esconder e não for carregado, o site funciona na mesma.

### Passo 4 — Ativar o GitHub Pages

1. No repositório, clique em **Settings** (separador de cima).
2. No menu da esquerda, clique em **Pages**.
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
4. Em **Branch**, escolha **main** e a pasta **/ (root)**. Clique em **Save**.
5. Aguarde 1 a 3 minutos e atualize a página. Vai aparecer:
   **"Your site is live at https://NOME-DE-UTILIZADOR.github.io/guest-guide/"**

### Passo 5 — Testar

Abra o endereço no telemóvel e no computador. Experimente mudar de idioma, copiar a password do Wi-Fi e abrir os botões do Google Maps.

---

## 4. Criar o QR Code definitivo

O QR Code tem de apontar para o endereço **final** do GitHub Pages. Por isso só é criado **depois** de o site estar publicado (passo 3).

### Opção A — Pela página geradora (recomendado, sem instalar nada)

1. Abra: `https://NOME-DE-UTILIZADOR.github.io/guest-guide/qr-code/`
2. O endereço do guia é preenchido automaticamente.
3. Clique em:
   - **Descarregar PNG (alta resolução)** → `qrcode.png` (≈ 2400 × 2400 px), para impressões comuns;
   - **Descarregar SVG (impressão profissional)** → `qrcode.svg` (vetorial, não perde qualidade), para a gráfica.
4. Em baixo encontra um **cartão A6 pronto a imprimir** para os quartos (logótipo + QR Code + "Guest Guide" nos 8 idiomas). Clique em **Imprimir cartão**.
5. (Opcional) Guarde os ficheiros `qrcode.png` e `qrcode.svg` na pasta `qr-code/` do repositório, para os ter sempre à mão.

### Opção B — Pela linha de comandos (para técnicos)

```bash
node tools/generate-qr.js https://NOME-DE-UTILIZADOR.github.io/guest-guide/
```

Cria `qr-code/qrcode.png` (300 dpi) e `qr-code/qrcode.svg`.

### Garantias do QR Code

- **Estático:** o endereço está gravado no próprio desenho. Não depende de nenhum serviço externo.
- **Nunca expira** e não tem custos nem subscrições.
- Não exige aplicações adicionais nem login: a câmara do iPhone e do Android leem-no diretamente.
- **Continua a funcionar depois de atualizar o site**, desde que **não mude o nome de utilizador nem o nome do repositório**.
- Usa correção de erros de nível "Q" (25%): continua legível mesmo com pequenos riscos ou dobras.

> Antes de imprimir em quantidade, faça sempre um teste: imprima um exemplar e leia-o com um iPhone e com um Android.

---

## 5. Atualizar o website no futuro

Todas as alterações podem ser feitas **diretamente no site do GitHub**: abra o ficheiro, clique no ícone do **lápis (Edit)**, altere e clique em **Commit changes**. O site é atualizado em 1 a 3 minutos e **o QR Code mantém-se igual**.

### Alterar textos ou horários

Os textos estão nos ficheiros da pasta `translations/`. **Altere sempre os 8 ficheiros** (`pt`, `en`, `fr`, `pl`, `it`, `es`, `de`, `ko`) para que todos os idiomas fiquem iguais.

Exemplo — mudar o horário do jantar em `translations/pt.json`:

```json
"dinnerHours": "19:00 – 21:00",
```

Regras importantes ao editar os `.json`:
- Altere **apenas o texto à direita**, entre aspas. Nunca altere o nome à esquerda (`"dinnerHours"`).
- Mantenha as aspas `"` e a vírgula no final da linha.
- Se precisar de aspas dentro de um texto, use as tipográficas “ ” ou « ».

| O que quer alterar | Onde |
|---|---|
| Horários do check-in/check-out | `checkin` → `checkinTime`, `checkoutTime`, `groupsTime`, `groupsText` (e `quick` → `checkinValue`, `checkoutValue`) |
| Horários das refeições | `meals` → `breakfastHours`, `lunchHours`, `dinnerHours` |
| Horário do bar | `bar` → `hours` |
| Aviso das refeições | `meals` → `noticeText` |
| Mensagem de boas-vindas | `welcome` → `p1`, `p2` |

### Alterar a password do Wi-Fi

A password está **só** no ficheiro `index.html`. Procure (Ctrl+F) por `data-wifi-password` e altere o número:

```html
<dd class="wifi-value wifi-pass" translate="no" data-wifi-password>12345678</dd>
```

O botão "Copiar password" passa a copiar automaticamente a nova password.

> Nota: num repositório público, tudo o que está no site fica visível na internet, incluindo a password do Wi-Fi (que de qualquer forma é mostrada aos hóspedes no guia).

### Substituir ou acrescentar fotografias

1. Prepare a fotografia em **JPG**, com cerca de **1400 px de largura**. Para a comprimir gratuitamente use **https://squoosh.app** (qualidade 75–80).
2. Dê-lhe **exatamente o mesmo nome** do ficheiro que vai substituir (ver tabela na secção 6).
3. No GitHub, abra `assets/images/` → **Add file → Upload files** → arraste a fotografia → **Commit changes**. O ficheiro antigo é substituído.
4. Se a nova fotografia for **real** (deixou de ser ilustração), abra `index.html` e apague a linha da etiqueta "Imagem ilustrativa" que está por baixo dessa imagem:
   ```html
   <span class="illus-badge" data-i18n="common.illustrative">Illustrative image</span>
   ```
5. Abra `service-worker.js` e aumente o número da versão, para que os telemóveis que já guardaram o guia recebam a nova imagem:
   ```js
   const VERSION = 'csn-guide-v1.0.1';
   ```

### Sempre que alterar ficheiros

Aumente o número da `VERSION` em `service-worker.js` (v1.0.1 → v1.0.2 …). Não é obrigatório para os textos (são sempre atualizados quando há internet), mas é recomendado para imagens.

---

## 6. Fotografias: o que é real e o que é ilustrativo

| Ficheiro | Utilização | Tipo |
|---|---|---|
| `hero-fatima.jpg` | Página inicial (vista sobre o Santuário) | **Fotografia real** fornecida |
| `logo-casa-sao-nuno.png` | Logótipo (fundo branco removido) | **Logótipo real** |
| `lobby-reception.jpg` | Boas-vindas / Receção | **Fotografia real** |
| `bar-lounge.jpg` | Bar (fotografia principal) | **Fotografia real** |
| `bar-terrace-view.jpg` | Bar (fotografia secundária) | **Fotografia real** |
| `breakfast.jpg` | Pequeno-almoço (sala de refeições, rés-do-chão) | **Fotografia real** |
| `lunch.jpg` | Almoço (restaurante, 1.º andar) | **Fotografia real** |
| `dinner.jpg` | Jantar (mesma foto do restaurante, outro enquadramento) | **Fotografia real** |
| `restaurant-d-duarte.jpg` | Restaurante D. Duarte | Ilustração — *substituir se tiver autorização para usar uma foto* |
| `aljustrel.jpg` | Aljustrel | Ilustração — *substituir por foto de Aljustrel* |

Não foram fornecidas fotografias do Restaurante D. Duarte nem de Aljustrel. Em vez de usar imagens genéricas da internet a fingir ser o hotel, foram desenhadas **ilustrações em linha dourada**, coerentes com a identidade visual, sempre marcadas com a etiqueta **"Imagem ilustrativa"** (traduzida nos 8 idiomas). Logo que tiver as fotografias reais, siga os passos da secção 5.

---

## 7. Como funcionam os idiomas

Idiomas disponíveis: **PT** (português europeu), **EN**, **FR**, **PL**, **IT**, **ES**, **DE**, **KO**.

Ordem de escolha do idioma quando o hóspede abre o guia:

1. Idioma escolhido manualmente numa visita anterior (fica guardado no navegador);
2. Idiomas preferidos do telemóvel (`navigator.languages` / `navigator.language`), por ordem;
3. Se nenhum estiver disponível (ex.: japonês) → **inglês**.

O hóspede pode mudar o idioma a qualquer momento no botão 🌐 no topo da página.

**Dica:** também pode partilhar um endereço com o idioma já escolhido, juntando `?lang=` + código. Por exemplo, `…/guest-guide/?lang=pl` abre em polaco.

Notas de tradução:
- Português exclusivamente de Portugal (PT-PT).
- Em coreano, os andares seguem a convenção coreana (o rés-do-chão é "1층"). Para evitar confusões, o 1.º andar aparece como **"2층 (현지 표기: 1층)"** = "2.º piso (indicação local: 1.º andar)".
- Os nomes dos pastorinhos seguem a forma tradicional de cada língua (ex.: *Łucja, Franciszek i Hiacynta* em polaco; *Lucie, François et Jacinthe* em francês; *Lucia, Francesco e Giacinta* em italiano; *루치아, 프란치스코, 히야친타* em coreano).

---

## 8. Funcionamento offline e instalação (PWA)

- Na **primeira visita com internet**, o guia guarda no telemóvel todos os textos (8 idiomas), fotografias, ícones e tipos de letra.
- A partir daí, **funciona sem internet**, incluindo a mudança de idioma.
- Com internet, o hóspede vê sempre a versão mais recente.

**Instalar como aplicação ("Adicionar ao ecrã principal"):**
- **Android (Chrome):** o botão do guia abre diretamente a janela de instalação do sistema; se o navegador não a disponibilizar, aparecem as instruções.
- **iPhone/iPad (Safari):** a Apple não permite instalação automática, por isso o botão mostra as instruções (Partilhar → Adicionar ao ecrã principal).
- **Computador:** ícone de instalação na barra de endereço (Chrome/Edge).

O nome da aplicação é **Casa São Nuno Guest Guide** e o ícone é o logótipo do hotel.

> O modo offline e a instalação só funcionam em **https** (o GitHub Pages usa https automaticamente). Ao abrir o `index.html` diretamente do computador (com duplo clique) estas funções ficam desativadas, o que é normal.

---

## 9. Testes realizados

Testes automáticos num navegador real (Chromium), com o site servido num **subdiretório** (tal como no GitHub Pages):

- ✅ Deteção automática dos 8 idiomas (pt-PT, en-GB, fr-FR, pl-PL, it-IT, es-ES, de-DE, ko-KR)
- ✅ Idioma não disponível (ja-JP) → inglês · pt-BR → português · de-AT → alemão
- ✅ Mudança manual de idioma e preferência mantida depois de recarregar
- ✅ 126 textos por idioma, nenhum em falta, sem erros na consola
- ✅ Botão "Copiar password" (e atalho do topo) → copia `12345678` e mostra a confirmação
- ✅ 4 links do Google Maps (ver localização e obter direções)
- ✅ Todas as imagens carregam
- ✅ Menu móvel, navegação entre secções, botão "voltar ao início"
- ✅ Instruções de instalação corretas para Android e iPhone
- ✅ Sem deslocamento horizontal em iPhone 13, iPhone SE (coreano, polaco e alemão) e Pixel 7
- ✅ Computador 1440 px
- ✅ PWA instalável (sem erros de instalabilidade nem do manifest)
- ✅ Funciona **offline** depois da primeira visita (textos, imagens e mudança de idioma)
- ✅ QR Code gerado e **lido com sucesso** por um descodificador

Depois de publicar, faça um teste final num iPhone e num Android reais (ler o QR Code, instalar, ativar o modo de voo e reabrir).

---

## 10. Resolução de problemas

| Problema | Solução |
|---|---|
| O site mostra "404" | Confirme que o `index.html` está na raiz do repositório e que o Pages está ativo (**Settings → Pages**). Aguarde 3 minutos. |
| Aparecem textos em inglês noutro idioma | Um ficheiro `.json` tem um erro (falta uma vírgula ou aspas). Verifique o ficheiro em https://jsonlint.com |
| Mudei uma imagem e o telemóvel mostra a antiga | Aumente a `VERSION` em `service-worker.js` e recarregue o guia duas vezes. |
| O QR Code não abre o guia | Confirme que o endereço do QR Code é exatamente o do GitHub Pages (com `/guest-guide/` no fim). |
| Quero um domínio próprio (ex.: guia.casasaonuno.pt) | Settings → Pages → **Custom domain**. Atenção: o QR Code tem de ser gerado para o novo endereço. |

---

**Tipos de letra:** Cormorant Garamond e Jost (SIL Open Font License, licenças em `assets/fonts/`). **Biblioteca de QR Code:** qrcode-generator de Kazuhiko Arase (licença MIT).

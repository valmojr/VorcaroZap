# VorcaroZap

Acervo documental independente, com interface inspirada no WhatsApp Web, para consultar mensagens tornadas públicas no caso Banco Master e conferir a fonte de cada transcrição.

**O projeto é uma amostra documental, não uma extração integral de celular, um serviço de mensagens ou uma conclusão sobre culpa.** Não tem vínculo com WhatsApp ou Meta. Não endossa partidos, candidaturas ou acusações. O compromisso é com transparência, isonomia, contexto e correção pública de erros.

## Executar

Requisitos: Node.js 22+, npm e Git. Git LFS é necessário para obter as imagens documentais já incorporadas.

```sh
git lfs install
git lfs pull
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Para gerar uma distribuição estática:

```sh
npm run build
npm run preview
```

Apenas `dist/` deve ser publicada. Não há backend, renderização no servidor, banco de dados, login, analytics ou coleta de conversas. React e os dados JSON são empacotados localmente. O tema fica no armazenamento local do navegador. Links de auditoria acessam sites externos apenas quando acionados. O site precisa ser servido por HTTP(S); abrir `index.html` com `file://` não é suportado.

## Publicar no GitHub Pages

O workflow [Validação e GitHub Pages](.github/workflows/checks.yml) está preparado para `valmojr/VorcaroZap`, na branch `main`. O endereço esperado após a primeira publicação é [valmojr.github.io/VorcaroZap](https://valmojr.github.io/VorcaroZap/).

1. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
2. Envie os arquivos revisados para `main`. Cada push executa validação, build e testes de navegador; somente depois publica. Também é possível executar **Actions → Validação e GitHub Pages → Run workflow**, selecionando `main`.
3. Acompanhe o job **Publicar no GitHub Pages** e a URL do ambiente `github-pages`.

Pull requests e outras branches apenas validam; forks não publicam por este workflow. O checkout baixa os arquivos LFS e o histórico para inspeção. O único artefato enviado ao Pages é `dist/`: nunca a raiz, a referência pessoal, relatórios temporários ou resultados de testes. Não é necessário cadastrar token pessoal: a publicação usa as permissões de Pages e OIDC do GitHub Actions, restritas ao job de deploy.

O Vite usa caminhos relativos (`base: "./"`), compatíveis com `/VorcaroZap/`; os links de mensagens usam fragmentos e não precisam de redirecionamento de rotas. Se mudar o nome do repositório ou a branch de publicação, atualize as condições do workflow e este endereço. Falha de LFS, testes ou guard interrompe a publicação. Veja a [documentação oficial de workflows do Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Consultar e auditar

- Pesquise por contato ou conteúdo, sem necessidade de acentuação.
- Use o filtro para limitar resultados a uma fonte. Uma fonte cadastrada como contexto pode não ter mensagens transcritas.
- Clique com o botão direito na mensagem ou use a seta no canto do balão. A seta também funciona por toque ou Tab + Enter; Shift+F10 abre a auditoria da mensagem focada.
- O menu mostra documento, página física e figura, com acesso direto ao PDF por `#page=N`. Metadados completos permanecem no JSON; contexto e fontes ficam no painel lateral, aberto pelo ícone de informações.
- Use **Copiar link da mensagem** para compartilhar uma URL estável com fragmento. Não exige configuração de rotas no servidor.

## Cobertura — consulta em 15/09/2026

São **446 registros em 21 conversas**: 371 textos, 52 notas, seis registros de exclusão, quatro fotos de visualização única indisponíveis, oito outros anexos indisponíveis, três transcrições/trechos de áudio e duas imagens reproduzidas do relatório. A última ampliação acrescentou 72 registros, com referência individual.

| Contato conforme fonte | Registros | Páginas físicas do relatório principal |
| --- | ---: | --- |
| Alexandre de Moraes BRASILIA | 60 | 37, 38, 39, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121, 123, 125, 127, 129, 131, 133, 135, 137, 139, 141, 143, 145, 147 |
| Flávio Bolsonaro | 2 | Imprensa e INQ 5.070, peça 1, pp. 10–11 |
| Martha Graeff | 38 | 177, 178, 179, 180, 181 |
| Fábio Faria | 77 | 19, 21, 22, 24, 32, 33, 35, 183, 188, 212, 213 |
| Vivi Moraes | 8 | 29, 31, 32 |
| Fabiano Zettel | 7 | 149 |
| Marcio Conjur | 18 | 182, 214, 215 |
| Diretor Paulo Sergio Bacen | 4 | 177 |
| Angelo Silva | 25 | 152, 154, 155 |
| Romy Banco Master | 8 | 153 |
| Alberto Felix de Oliveira Neto | 12 | 156, 157 |
| Leo Palhares Palhares | 23 | 161, 164, 167, 171 |
| Marcos Prime | 13 | 165, 168 |
| Ana Claudia Financeiro1 | 3 | 170 |
| Ciro Soares | 39 | 202, 203, 204, 205, 206, 207, 210, 211 |
| Ana Matos Mkt | 54 | 186, 189, 190, 193, 194, 195, 196, 216 |
| Leo Serrano Giunchetti | 4 | 184 |
| Luiz Rennó | 8 | 185 |
| Geraldo Brazil Journal | 11 | 187 |
| Thatiane Prime | 16 | 25 |
| Michael | 16 | 26, 27, 28 |

### Como ler os recortes

- **Campos do Jordão e contratos:** 72 novos registros nas figuras 17, 20–24, 29–31, 33, 35 e 36. Incluem Thatiane Prime e Michael, o áudio de Fábio transcrito integralmente pela PF e novas trocas com Vivi. Localização tarjada, cartão de contato e balões cortados foram omitidos com indicação na auditoria. A foto mencionada por Michael não foi obtida.

- **Moraes:** 52 notas atribuídas a Vorcaro, de 28/10 a 17/11/2025. Cinco são vinculadas ao chat de 17/11; 47 são associações feitas pela PF entre arquivos e logs. A interface distingue expressamente essas duas situações. As referências incluem a nota, a figura correspondente e, quando aplicável, o anexo do chat. As quatro fotos recebidas não tiveram conteúdo recuperado nesta fonte: nenhuma resposta foi inventada.
- **Martha:** 29 mensagens do relatório, duas citações breves da Folha e sete mensagens sobre o encontro no Planalto publicadas pela CNN. A busca por “peleleca” encontra contexto editorial com fonte; não cria uma conversa literal a partir de memes nem reproduz intimidade sexual explícita vazada.
- **Flávio Bolsonaro:** trecho do áudio de 08/09/2025, com acesso à gravação na publicação da CNN, e mensagem de 16/11/2025 publicada pelo Intercept. A resposta do senador sobre patrocínio privado está no painel de fontes. O arquivo original do aparelho não foi obtido. A representação da PF no INQ 5.070 foi acrescentada como referência complementar: a página 11 reproduz a mensagem de novembro; a página 10 descreve o áudio, sem fornecer sua transcrição integral ou o arquivo.
- **Lula:** a confirmação pública do encontro de 04/12/2024 e o esclarecimento da Presidência são contexto da conversa com Martha. Não foi criada uma conversa direta com Lula. A busca por “Lula” encontra esse contexto.
- **Encaminhamentos:** autores atribuídos aparecem identificados quando a fonte permite. Um encaminhamento atribuído a Paulo Gonet dentro do chat com Ciro não se transforma em conversa direta com Gonet.
- **Londres:** 87 novos registros nas figuras 189–198 e 202–205: Fábio Faria, Leo Serrano, Luiz Rennó, Geraldo Brazil Journal e Ana Matos. Mantêm-se as respostas legíveis e os nomes dos anexos, com omissões e tarjas declaradas. As figuras 199–201 ainda não estão transcritas nesta ampliação.
- **Mídia:** a foto e o convite são reproduções em baixa resolução do PDF, não os arquivos originais do WhatsApp. Clique na imagem para abrir o arquivo inteiro extraído. Os áudios de Ciro e Fábio são textos transcritos pela PF. O áudio de Flávio tem trecho transcrito pela imprensa e link para ouvir a gravação publicada.

As transcrições do relatório foram conferidas nas figuras renderizadas; citações jornalísticas foram conferidas no texto das reportagens. A seleção privilegia recortes legíveis com localização documental; não é a íntegra do celular nem de todas as figuras do relatório. Há intervalos, omissões por legibilidade e conteúdo não incorporado. A continuação da figura 148 após “Ontem, no caso” permanece fora desta seleção. A placa de veículo na figura 14 foi substituída por `[placa omitida]`. Não se reproduzem fotos de perfil, telefones, dados bancários ou identificadores privados.

Horário ausente significa “não transcrito por legibilidade/tarja”, nunca meia-noite. Datas de publicação de notícias não são usadas como datas de mensagens. Datas de envio explicitadas por reportagens são registradas com essa atribuição. Os horários do diálogo de 04/12/2024 seguem a CNN, que não informa o fuso; a interface não os declara UTC−03:00. A conversa com Ana Matos tem data ausente devido à divergência entre a narrativa e a figura. Divergências de segundos nos logs e de conversão UTC constam na auditoria individual. O nome do contato segue a fonte; não é uma identificação independente.

## Fontes e limites

1. [IPJ-A nº 3298613/2026, de 27/08/2026 — PDF publicado pelo Poder360](https://static.poder360.com.br/uploads/2026/09/pet16662_relatorio_pf_celular_vorcaro_moraes_gonet_andrei_barci.pdf): documento de 218 páginas atribuído à Polícia Federal. Principal fonte das transcrições. As figuras utilizadas foram renderizadas e conferidas visualmente. A cópia traz tarjas e a classificação original “SIGILOSO”; sua divulgação posterior é documentada pela imprensa.
2. [Decisão de 03/03/2026 na Petição 15.556/DF — publicação oficial do STF](https://noticias-stf-wp-prd.s3.sa-east-1.amazonaws.com/wp-content/uploads/wpallimport/uploads/2026/03/04111648/decisao-Op.-Compliance-Zero.pdf): 48 páginas, cadastrada como contexto, sem mensagens incorporadas nesta versão.
3. [Folha: publicação do documento e contexto de contestação, 01/09/2026](https://www1.folha.uol.com.br/poder/2026/09/leia-integra-de-documento-da-pf-com-mensagens-de-vorcaro-sobre-moraes-gonet-e-chefe-da-pf.shtml): relata pedido da PGR de anulação. O acervo não afirma o desfecho desse pedido e não atualiza automaticamente o estado processual.

4. [Anexo do chat atribuído a Alexandre de Moraes — Poder360](https://static.poder360.com.br/uploads/2026/09/pet16662-whatsapp-vorcaro-alexandre-moraes-sigiloderrubado-1set2026.pdf): três páginas com eventos de mídia e exclusões; não revela o conteúdo das fotos recebidas.
5. [Folha: repercussão das mensagens com Martha, 06/03/2026](https://www1.folha.uol.com.br/blogs/hashtag/2026/03/sexting-cebolinha-mensagens-intimas-de-vorcaro-viralizam-nas-redes.shtml): duas citações breves, contexto de circulação do termo e contestação da defesa sobre edição e falta de contexto.
6. [Reuters/UOL: posicionamento do escritório, 01/09/2026](https://noticias.uol.com.br/ultimas-noticias/reuters/2026/09/01/moraes-descartou-impedimento-para-escritorio-da-esposa-atender-banco-master-diz-nota.amp.htm): contraponto documental acessível no painel das conversas relacionadas.

7. [Intercept: mensagens, documentos e áudio de Flávio, 13/05/2026](https://www.intercept.com.br/2026/05/13/audio-flavio-negociou-vorcaro-milhoes/): apuração original e datas de envio.
8. [CNN: gravação, transcrição e resposta de Flávio, 13/05/2026](https://www.cnnbrasil.com.br/politica/ouca-o-audio-de-flavio-bolsonaro-pedindo-dinheiro-a-vorcaro/): fonte do trecho e da reprodução externa.
9. [CNN: diálogo com Martha sobre o encontro com Lula, 05/03/2026](https://www.cnnbrasil.com.br/politica/vorcaro-sugere-que-encontro-com-lula-fora-da-agenda-foi-otimo/): sete citações breves do diálogo de 04/12/2024, com omissões declaradas.
10. [Folha: reunião no Planalto e esclarecimento da Presidência, 05/02/2026](https://www1.folha.uol.com.br/mercado/2026/02/nao-havia-investigacao-formal-sobre-carteiras-do-master-quando-lula-se-encontrou-com-vorcaro.shtml): confirmações públicas e ressalva cronológica.

11. [Representação da PF — INQ 5.070, peça 1](https://static.poder360.com.br/uploads/2026/09/peca_1_Inq_5070.pdf): 16 páginas; descreve as comunicações sobre Dark Horse e remete à IPJ-A nº 270/2026. É uma peça de síntese, não a íntegra do relatório técnico nem do chat.

O [inventário de fontes e lacunas](docs/FONTES.md) registra os acervos maiores localizados, a disponibilidade e o que falta obter.

As URLs, datas de consulta e hashes SHA-256 das cópias baixadas estão no cadastro das fontes. O hash identifica a cópia consultada; não atesta sua autenticidade institucional. O relatório contém análises e atribuições dos investigadores. Conferir uma transcrição não prova a verdade do relato, a autoria de encaminhamentos ou responsabilidade criminal. A decisão cautelar também não equivale a condenação definitiva.

Não foram obtidos arquivos originais de imagens, áudios ou vídeos das conversas selecionadas. Uma foto reproduzida na página 205 e a imagem inteira do convite na página 185 foram extraídas do próprio PDF, sem edição, e têm procedência em `public/assets/manifest.json`. A transcrição do áudio não substitui o arquivo sonoro. A gravação atribuída a Flávio pode ser ouvida no link externo da CNN, sem redistribuição local. Os demais anexos permanecem indisponíveis. Os PDFs permanecem em seus hospedeiros de origem: não foram redistribuídos junto ao site. Links externos podem mudar ou ficar indisponíveis; nesses casos, mantenha o registro da referência e abra uma correção.

## Dados e manutenção

`src/data/archive.json` contém `sources`, `conversations` e `messages`. Tipos e validação estão em `src/archive.ts`. Cada mensagem exige ao menos uma referência. PDFs exigem página física válida. Reportagens usam URL e contexto, sem página fictícia. IDs publicados são estáveis: não renumere registros existentes. `evidence` distingue chat, associação forense e citação jornalística; `delivery` distingue visualização única registrada e inferida. `editorialNotes` guarda contexto com fonte, fora dos balões de mensagens. `mediaSourceId` liga um trecho de áudio à publicação que permite ouvi-lo; não carrega mídia externa automaticamente. `timeZone: "unspecified"` sinaliza horário publicado sem fuso identificado.

Para adicionar mídia, use `public/assets/`, com procedência, vínculo à mensagem, condições de reprodução e SHA-256 em um manifesto. Adapte o componente para o tipo de mídia e adicione teste antes de publicá-la. A versão atual renderiza texto, notas com classificação de evidência, imagem documental e transcrição de áudio; não possui player para arquivos ausentes. `.gitattributes` configura Git LFS para PDFs, imagens, áudio e vídeo nessa pasta.

```sh
git lfs install
git lfs pull
```

A hospedagem deve executar o build após obter os objetos LFS. O guard rejeita ponteiros LFS em `public/assets/` e `dist/`.

## Proteção obrigatória da referência pessoal

A exportação pessoal local `WhatsAppReal.html` e a pasta `WhatsAppReal_files/` são **proibidas no Git, no site, em capturas públicas e em fixtures**. Estão no `.gitignore`. Não use `git add -f` nesses caminhos, não copie seu conteúdo e não publique a raiz do repositório.

`npm run guard` verifica o índice e o histórico por esses caminhos, detecta cópias integrais mesmo renomeadas no índice, histórico e arquivos locais candidatos a commit e procura referências ao runtime pessoal no código/assets/build. A comparação de conteúdo depende da referência pessoal estar presente localmente; a CI não recebe essa referência e mantém as verificações de caminhos, runtime e LFS. Não substitui revisão humana: trechos modificados ou copiados parcialmente exigem inspeção do diff. O HTML pessoal e seus scripts não são executados pelo projeto.

Ative a proteção pré-commit em seu clone:

```sh
git config core.hooksPath .githooks
```

A CI também roda o guard, testes e build. Nunca coloque as referências pessoais em `public/`.

## Validação

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Opcionalmente, use um Chromium já instalado: `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/caminho/do/chromium npm run test:e2e`.

Os testes verificam cópias pessoais sintéticas renomeadas e preparadas no índice, ponteiros LFS, referências, paginação, IDs, busca, anexos ausentes, auditoria por botão direito/teclado/toque, links diretos, tema persistente, layout móvel e ausência de requisições externas no uso inicial. Testes automáticos não validam a veracidade do conteúdo; cada inclusão exige revisão da fonte original.

## Contribuir e corrigir

Leia [CONTRIBUTING.md](CONTRIBUTING.md) e [AGENTS.md](AGENTS.md). Correções devem trazer referência precisa, mudança proposta e justificativa objetiva. Não inclua dados pessoais em issues. Conteúdo pessoal publicado pode ser incluído quando a reprodução for permitida, com proteção de menores, dados sensíveis e intimidade não consensual.

O código original usa licença MIT. Documentos, nomes, marcas, mensagens e mídias de terceiros não recebem automaticamente essa licença; preserve atribuição e verifique condições de reprodução. O projeto não reivindica a marca WhatsApp.

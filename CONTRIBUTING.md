# Como contribuir

O VorcaroZap facilita a consulta de mensagens públicas com fontes auditáveis. Toda contribuição deve procurar ser **transparente, isônoma e despolitizada**. Aplicamos o mesmo padrão de prova, contextualização e privacidade a todas as pessoas e instituições.

## Princípios

1. **Transparência:** explique de onde veio o material, como foi conferido e o que foi omitido.
2. **Isonomia:** não selecione ou edite mensagens para favorecer partidos, candidaturas ou narrativas pessoais.
3. **Neutralidade de linguagem:** diferencie fato documentado, alegação, análise e hipótese. Não apresente investigação como condenação.
4. **Contexto:** preserve sequência, encaminhamentos, tarjas e respostas disponíveis. Sinalize quando a conversa está incompleta.
5. **Correção:** aceite evidência que contradiga a leitura inicial; registre retificações de forma rastreável.

## Preparar o ambiente e enviar uma contribuição

Faça um fork e clone-o. Use Node.js 22, npm e Git LFS:

```sh
git switch -c minha-contribuicao
git lfs install
git lfs pull
git config core.hooksPath .githooks
npm ci
npm run dev
```

Mantenha alterações pequenas e com um objetivo claro. Antes do commit, execute:

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
git diff --check
git diff --cached --stat
```

Selecione explicitamente os arquivos a adicionar e revise o diff preparado localmente. Nunca force a inclusão de arquivos ignorados nem anexe a exportação pessoal para reproduzir problemas; use fixtures sintéticas. Envie sua branch ao fork e abra um pull request para `valmojr/VorcaroZap`, branch `main`, com a justificativa e os resultados das verificações. A CI valida pull requests; a publicação ocorre somente após integração em `main` no repositório principal. Não inclua `dist/` no commit.

## Antes de abrir uma alteração

- Consulte issues existentes e a cobertura no README.
- Encontre o documento integral em órgão público ou veículo de relevância. Não use prints sem procedência ou apenas resultados de busca.
- Confirme a disponibilidade pública sem contornar autenticação, paywall ou controle de acesso.
- Verifique identidade do documento, versão, data, autoria institucional, hospedeiro da cópia e número de páginas.
- Confira texto e horário na imagem da página. OCR é auxiliar, não validação final.
- Verifique se o material pode ser reproduzido. Não copie reportagens integrais: use trechos permitidos, referência e contexto.

## Mensagens e fontes

Edite `src/data/archive.json` preservando IDs existentes. Uma mensagem precisa de conversa, remetente conforme fonte, conteúdo, data/horário conhecidos ou nulos e pelo menos uma referência. Use `kind: "attachment"` para anexos comprovadamente presentes mas indisponíveis. Não preencha lacunas com hipóteses.

Cada referência a PDF deve indicar página física, página impressa quando houver e figura. A página física começa em 1, incluindo capa. Notícias devem apontar a URL da publicação que efetivamente sustenta a transcrição. Cadastre também título, órgão/veículo, hospedeiro, data e consulta. Para arquivo baixado, calcule SHA-256 e identifique a versão; isso não autentica o documento por si só.

Se a fonte discordar de outra, conserve a divergência e as duas referências. Não resolva autoria incerta por semelhança de apelidos. Mensagens encaminhadas não criam interlocução direta com o suposto autor original.

## Privacidade e mídias

A exportação pessoal local e todos os seus derivados são proibidos no Git, na distribuição, em issues e em testes. Consulte a seção de proteção do README. Nunca copie fotos de perfil ou dados privados da referência visual.

Conteúdo pessoal já publicado pode integrar o acervo quando sua reprodução for permitida. Oculte identificadores sensíveis e proteja menores; não inclua material íntimo não consensual. Registre omissões com marcadores explícitos. Links para fontes externas não autorizam duplicar tudo o que elas hospedam.

Imagens, vídeos e áudios precisam de fonte verificável, ligação à mensagem, condições de reprodução e hash. Guarde em `public/assets/` usando LFS. Um player só deve ser adicionado quando houver arquivo real e teste de reprodução. Não fabrique mídia ausente nem use foto de notícia como se fosse anexo da conversa.

## Checklist do pull request

- [ ] Objetivo e mudança descritos de forma objetiva, sem slogans ou juízos de culpa.
- [ ] URLs, páginas, figuras e contexto permitem reproduzir a conferência.
- [ ] Transcrição revisada visualmente contra o original.
- [ ] Incertezas, tarjas, omissões e encaminhamentos identificados.
- [ ] Dados sensíveis e referência pessoal ausentes do diff e do build.
- [ ] Cobertura e limitações atualizadas na documentação e na interface.
- [ ] `npm test` e `npm run build` passaram.
- [ ] Testes Playwright e revisão desktop/celular feitos quando aplicáveis.
- [ ] Arquivos LFS resolvidos, sem ponteiros na distribuição.

Alterações documentais devem receber revisão independente antes de integração. Revisores devem conferir evidências, não concordância política. Havendo dúvida material, mantenha o novo conteúdo fora do acervo publicado até resolução.

## Correções e remoções

Abra issue com ID da mensagem, fonte, página, descrição do problema e correção proposta. Não replique dados sensíveis na issue. Para uma questão de privacidade, indique apenas o ID e a categoria do dado; o mantenedor poderá remover preventivamente o trecho e registrar a justificativa sem republicá-lo. Correções de fatos devem manter rastro no histórico, exceto conteúdo que precise ser removido por privacidade.

## Classificação de evidências e contexto

Diferencie conteúdo visível no chat, notas associadas pela perícia e citações da imprensa usando `evidence` e `delivery`. Não apresente correlação forense como envio diretamente comprovado. Mídias de visualização única sem conteúdo e exclusões permanecem registros de indisponibilidade. Transcrição de áudio não é arquivo sonoro; imagem extraída de relatório não é original do aparelho. Registre divergências de data e horário em `note`, sem preencher lacunas por suposição. Contexto e posicionamentos documentados ficam em `editorialNotes`, com fonte, fora dos balões. Atualize a tabela de cobertura do README, o inventário `docs/FONTES.md` e, quando houver mídia, `public/assets/manifest.json` ao ampliar o acervo.

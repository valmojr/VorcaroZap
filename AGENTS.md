# Instruções para agentes — VorcaroZap

## Finalidade

Manter um acervo documental estático de mensagens públicas do caso Banco Master, com interface semelhante ao WhatsApp Web e auditoria por mensagem. Trabalhe com transparência, isonomia e linguagem despolitizada. Não presuma culpa, não promova partidos e não transforme interpretações em mensagens literais.

## Privacidade da referência local

- Nunca rastreie, copie para arquivos públicos, imprima em logs ou reutilize conteúdo de `WhatsAppReal.html` e `WhatsAppReal_files/`.
- Não execute scripts da exportação. Não remova a proteção do `.gitignore` nem use `git add -f`.
- Não use contatos, avatares, mensagens, imagens, telefones ou metadados pessoais como demonstração, teste ou screenshot.
- Publique somente `dist/`; verifique o índice e o build com `npm run guard`.
- A comparação com arquivos pessoais depende de sua presença local; nunca envie a referência à CI. Não declare ausência absoluta de trechos privados apenas porque o guard passou.

## Dados documentais

- Mensagens reais exigem fonte inspecionada, localização exata e transcrição conferida visualmente.
- Prefira documentos oficiais integrais. Quando a cópia vier da imprensa, diferencie autor institucional e hospedeiro.
- Não use snippets de busca, redes sociais, acervos partidários ou OCR sem conferência como comprovação suficiente.
- Preserve grafia e ordem. Não invente datas, horários, respostas, confirmações de leitura ou presença online.
- Diferencie contato salvo, identidade atribuída e autor de mensagem encaminhada. Não converta uma citação em diálogo direto.
- Registre omissões, tarjas, recortes, divergências, incertezas e contestações com evidência.
- IDs são estáveis. Cada mensagem exige referência; PDF exige número da página física e, quando disponível, impressa/figura.
- Mantenha README e apresentação da cobertura sincronizados com o acervo.

## Mídias

Incorpore apenas arquivos com vínculo demonstrado à conversa e reprodução permitida. Nunca substitua um anexo ausente por imagem ilustrativa ou conteúdo gerado. Proteja dados sensíveis, menores e intimidade não consensual. Use `public/assets/`, manifesto de procedência e Git LFS. Não distribua ponteiros LFS.

## Implementação e testes

React, TypeScript, Vite, CSS e JSON local. Sem backend, analytics, autenticação ou importação de WhatsApp pessoal. Links por fragmentos devem funcionar em hospedagem estática e subdiretórios. Auditoria precisa funcionar por mouse, toque e teclado. Não introduza controles que aparentem funções de mensagens ao vivo.

Antes da entrega, execute `npm test`, `npm run build` e os testes Playwright quando alterar navegação/layout. Confira desktop e celular. Faça revisão documental manual para dados alterados. Não declare uma fonte autenticada apenas por possuir hash. Registre limites dos testes e do acervo. Não faça publicação ou push sem solicitação.

O workflow `.github/workflows/checks.yml` valida pushes e pull requests. O deploy do Pages depende da validação e é restrito a `main` em `valmojr/VorcaroZap`. Preserve o download LFS, o histórico completo para o guard, as permissões de publicação restritas ao job de deploy e o artefato limitado a `dist/`. Ao alterar hospedagem, confira links e imagens sob `/VorcaroZap/`.

## Classificação de evidências e contexto

Diferencie conteúdo visível no chat, notas associadas pela perícia e citações da imprensa usando `evidence` e `delivery`. Não apresente correlação forense como envio diretamente comprovado. Mídias de visualização única sem conteúdo e exclusões permanecem registros de indisponibilidade. Transcrição de áudio não é arquivo sonoro; imagem extraída de relatório não é original do aparelho. Registre divergências de data e horário em `note`, sem preencher lacunas por suposição. Contexto e posicionamentos documentados ficam em `editorialNotes`, com fonte, fora dos balões. Atualize a tabela de cobertura e o manifesto ao ampliar o acervo.

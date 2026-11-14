# Publicar no GitHub Pages

O repositório remoto é `ValdemiroAmerico/Kweva_website`. Sem domínio próprio, o endereço previsto é:

https://valdemiroamerico.github.io/Kweva_website/

## Publicação

1. Faça commit e push dos ficheiros do projeto, incluindo as novas páginas, estilos, scripts e `.github/workflows/pages.yml`.
2. No GitHub, abra **Settings → Pages → Build and deployment → Source** e selecione **GitHub Actions**.
3. Abra **Actions → Publish GitHub Pages → Run workflow** e escolha a versão que pretende publicar.
4. Aguarde o job `deploy` concluir. O endereço publicado aparece no ambiente `github-pages`.

O workflow só publica quando iniciado manualmente. Durante a preparação, obtém o endereço real do Pages, atualiza metadados e sitemap, verifica os ficheiros e monta um pacote com os recursos usados no site. Não publica os relatórios de revisão, capturas de ecrã, documentos de edição ou imagens de experiências antigas. Os PDFs dos cursos ligados nas páginas fazem parte do pacote.

Documentação oficial: [workflows do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Antes de publicar outra versão

```sh
python3 scripts/check-site.py
```

Para preparar uma pasta de publicação local, use uma pasta vazia:

```sh
python3 scripts/build-static.py --output _site
```

O script recusa pastas de saída com conteúdo para evitar manter ficheiros antigos. A pasta `_site` não entra no Git.

## Confirmar depois da primeira publicação

- Abra o site pelo endereço do Pages e teste navegação, idiomas e os PDFs.
- Envie uma mensagem de teste e confirme a receção no destinatário `valdemiroeusebio2@gmail.com`. Se o FormSubmit pedir ativação, confirme-a no e-mail e repita o teste.
- Faça também um teste de inscrição e de candidatura com um PDF para confirmar a entrega dos três fluxos. O teste local confirma validação e montagem dos dados; não confirma entrega de e-mail nem anexos.
- Confirme que o endereço de WhatsApp público (`+55 31 97245-6077`) e os perfis sociais pessoais associados continuam a ser os contactos desejados.

## Quando tiver domínio próprio

```sh
python3 scripts/configure-site.py --url https://o-seu-dominio.mz
```

Configure o domínio no GitHub Pages antes da publicação. O workflow volta a usar o endereço comunicado pelo Pages. Para mudar o destinatário dos formulários, use `--email`; isso não altera automaticamente os contactos escritos no texto da página de contacto ou da política de privacidade.

Nenhuma publicação, alteração de definições do GitHub ou submissão real de formulário foi executada durante a revisão local.

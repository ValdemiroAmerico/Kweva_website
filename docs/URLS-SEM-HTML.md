# Endereços sem extensão — 15 de novembro de 2026

A geração de publicação cria 17 páginas em pastas com `index.html`, mantendo a página inicial na raiz e a página 404 no formato exigido pelo alojamento. Os HTML antigos são encaminhamentos para as novas rotas; não há mudança de conteúdo ou de estilo nesta revisão.

## Verificação

- Sete testes de regressão passaram, incluindo geração de metadados para domínio próprio e projeto GitHub Pages.
- As 770 referências locais do pacote resolveram sem erros: ligações entre páginas, âncoras, estilos, imagens, scripts e documentos.
- As 19 páginas passaram em 76 cenários de navegador: desktop/mobile e português/inglês.
- Passaram 109 verificações funcionais e de encaminhamento, incluindo os 17 URLs antigos com parâmetros e âncoras, inscrições com curso pré-selecionado, biografia, menus, FAQ e validação de formulários. Nenhum formulário foi enviado.
- O sitemap e os URLs canónicos usam as rotas com barra final e sem `.html`.
- Testado servindo o pacote sob `/Kweva_website/`, como no GitHub Pages.

Evidência: `docs/qa/clean-urls/routes.json` e `docs/qa/clean-urls/functional.json`.

A publicação ainda precisa de commit, push e execução manual de `Publish GitHub Pages`. Os ficheiros HTML de edição na raiz são preservados; os endereços novos aparecem no pacote produzido por `scripts/build-static.py`.

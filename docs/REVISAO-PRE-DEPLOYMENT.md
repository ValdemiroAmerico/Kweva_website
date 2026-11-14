# Revisão antes da publicação — 14 de novembro de 2026

Resultado: revisão local concluída sem falhas nos testes descritos abaixo. A publicação e a entrega real de e-mails continuam por executar.

## Âmbito e resultados

| Verificação | Resultado |
| --- | --- |
| Estrutura, recursos e referências locais | 19 páginas; zero erros e zero avisos de configuração |
| Layout e idiomas no Chrome | 190 cenários: 19 páginas × 5 larguras × PT/EN |
| Larguras verificadas | 320, 390, 768, 1101 e 1440 px |
| Transbordamento lateral, imagens visíveis sem carregar, ações vazias e título principal | Zero falhas nos 190 cenários |
| Acessibilidade automática | 76 análises axe-core 4.10.3: 19 páginas × PT/EN × 390/1440 px; zero violações nas regras WCAG A/AA selecionadas |
| JavaScript | Todos os ficheiros compilam; zero eventos de erro na matriz do navegador |
| Fluxos e estados especiais | 96 verificações funcionais passaram |
| Formulários | 14 formulários com validação e submissão capturada localmente; nenhum envio real |
| Pacote de publicação | 66 ficheiros públicos, aproximadamente 4,05 MiB |
| Sitemap | 16 páginas indexáveis; respeita `noindex` de Projetos, da análise demonstrativa e da página 404 |
| Programas dos cursos | Ambos os PDFs existem e têm cabeçalho PDF válido |

O navegador serviu o pacote de publicação sob `/Kweva_website/`, simulando o caminho do projeto no GitHub Pages. Não foi apenas uma revisão dos ficheiros na raiz do servidor.

## Problemas corrigidos

- Contraste de texto turquesa, botões e estados ativos do menu. Foram criados tons próprios para texto e ações, preservando o tom das barras decorativas.
- Atributos de acessibilidade nos ícones sociais sem ligação.
- Página 404: caminhos de estilos, imagens e navegação funcionam também quando o URL inexistente tem subpastas. Foi acrescentado `noindex`.
- Metadados de partilha, URLs canónicos, sitemap e referência ao sitemap preparados para o endereço previsto do repositório.
- Recursos CSS e JavaScript identificados pela versão do conteúdo para evitar servir versões antigas do navegador.
- Equipa: o perfil HTML de reserva passou a mostrar a pessoa real, com biografia acessível, em vez de cartões com nomes e funções de exemplo. Foi testado sem JavaScript e com o JSON bloqueado; o perfil de reserva também traduz para inglês quando o JavaScript funciona.
- Documentação de Carreiras corrigida para refletir as três páginas separadas.
- Preparação de um pacote de publicação que inclui os recursos usados e os programas em PDF, excluindo relatórios, capturas de ecrã, DOCX de edição e fotografias de experiências anteriores.

## Comportamentos verificados

- Menu mobile abre e fecha; dropdowns mantêm a largura compacta no desktop; Escape fecha e devolve o foco.
- Seleção de idioma, fecho do seletor e tradução dos títulos e principais textos das páginas.
- Biografia abre no cartão, mantém o estado ao trocar de idioma e recolhe com o teclado. Os botões de contacto removidos não voltaram a aparecer.
- FAQ expande nativamente.
- Campos obrigatórios e consentimento, quando aplicável, impedem formulários incompletos.
- Candidatura recusa extensões diferentes de PDF e anexos acima de 5 MB; a mensagem de erro acompanha o idioma.
- Os formulários montam dados por POST para HTTPS com o campo anti-spam vazio; todos os eventos de submissão foram intercetados e cancelados localmente.
- Links de inscrição pré-selecionam Excel e R corretamente.
- URLs antigos de Carreiras com `#vagas` e `#candidatura` encaminham para as páginas atuais.
- Uma página 404 em URL com subpastas mantém estilos, logótipo e ligação para o início.
- Ligações externas de referência para UNFPA, documentação e política de privacidade do FormSubmit foram abertas com sucesso durante a revisão. Não foram confirmados os conteúdos privados ou a titularidade dos perfis sociais.

## Evidência

- `qa/predeployment/browser.json`: matriz das 190 verificações de layout e idiomas.
- `qa/predeployment/*-axe.json`: resultados das 76 análises de acessibilidade.
- `qa/predeployment/runtime-events.json`: erros de runtime na matriz do navegador.
- `qa/predeployment/functional.json`: verificações funcionais.
- `qa/predeployment/home-390.png`, `home-1440.png`, `about-390.png` e `about-1440.png`: capturas das páginas verificadas.

Os testes de acessibilidade são automáticos; não constituem uma certificação WCAG. A revisão de navegador foi feita no Chrome, sem simular a velocidade de uma ligação móvel e sem uma execução separada em Safari ou Firefox.

## Publicação e confirmação externa

O endereço foi inferido do remoto Git: `https://valdemiroamerico.github.io/Kweva_website/`. O workflow manual usa o endereço efetivo fornecido pelo GitHub Pages durante a execução.

O workflow está preparado, mas não foi executado no GitHub. Nenhuma definição do repositório foi alterada e nenhum push ou deployment foi feito. Consulte [PUBLICACAO.md](PUBLICACAO.md).

Depois da primeira publicação, confirme a receção real de mensagens, inscrições e CVs em `valdemiroeusebio2@gmail.com`, incluindo ativação do FormSubmit se solicitada. As validações locais não confirmam entrega de e-mail, anexos ou CAPTCHA. Consulte a [documentação do FormSubmit](https://formsubmit.co/documentation).

O WhatsApp público continua a ser `+55 31 97245-6077`, e as redes sociais configuradas são perfis pessoais. Estes contactos foram preservados; confirme que são os que deseja divulgar.

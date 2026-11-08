# Revisão local do site

Verificação executada no Chrome em modo headless, com servidor HTTP temporário.

- Todas as páginas: larguras de 1440, 1105, 390 e 320 px, sem overflow horizontal detetado e sem erros de JavaScript.
- Menus: abertura por clique, Esc e submenu no telemóvel. Corrigido o conflito entre hover e clique que fechava o submenu.
- Equipa: janela abre e fecha em computador e telemóvel; Esc devolve o foco ao botão.
- Contacto, inscrição e carreiras: campos obrigatórios e POST verificados. Pedidos intercetados localmente, sem envio externo.
- Carreiras: multipart e CV presentes no pedido; rejeição de PDF acima de 5 MB no navegador.
- Idioma: alternância para inglês e títulos verificados em Início, Academy, Equipa, Contacto e Carreiras.
- Referências locais: sem ficheiros em falta detetados.
- Capturas inspecionadas: página inicial, cartão de contacto e perfil no telemóvel.

Corrigidos os títulos de partilha das páginas e os metadados de Carreiras, bem como a tradução dos títulos das novas páginas. A entrega de e-mail e anexos pelo serviço externo não foi novamente testada nesta revisão. Não foram executados testes em Safari, Firefox ou aparelhos físicos.

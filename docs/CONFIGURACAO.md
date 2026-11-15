# Configuração dos formulários

Contactos e candidaturas enviam por POST para o FormSubmit, com receção provisória em valdemiroeusebio2@gmail.com. O visitante conclui a verificação e vê a confirmação no serviço. Não precisa de copiar mensagens nem abrir uma aplicação de correio. Os dados são processados pelo FormSubmit (https://formsubmit.co/).

## Ativar e testar

Sirva o site por HTTP: `python3 -m http.server 8000`. Abra http://localhost:8000/inscricao.html e faça uma candidatura de teste. Confirme a ativação enviada pelo FormSubmit ao destinatário; verifique também o spam. Depois da ativação, faça novo envio e confirme a receção na caixa de entrada. O CAPTCHA padrão está ativo; existe também um campo honeypot.

Não foi enviado nenhum formulário automaticamente durante a implementação. A entrega real ainda exige ativação e teste pelo destinatário.

## Alterar destinatário e domínio

```sh
python3 scripts/configure-site.py --email contacto@o-seu-dominio.mz --url https://o-seu-dominio.mz
```

Pode configurar apenas `--email` ou `--url`. Um novo destinatário precisa de confirmar a ativação do FormSubmit. O script atualiza os destinos dos formulários; o contacto pessoal da equipa é independente. Os metadados estão preparados para o endereço previsto `https://kweva-research.github.io/Kweva_website/`; o workflow usa o endereço real fornecido pelo Pages. Consulte [PUBLICACAO.md](PUBLICACAO.md).

## Carreiras

As páginas `carreiras.html`, `vagas.html` e `candidatura.html` apresentam, respetivamente, o trabalho na Kweva, as oportunidades e o formulário de candidatura espontânea. Atualize `vagas.html` quando houver oportunidades reais. O formulário envia o CV por FormSubmit com `multipart/form-data`, para o mesmo destinatário dos restantes formulários. Aceita PDF até 5 MB, com validação no navegador. Teste a entrega do anexo após ativar o formulário, se o serviço solicitar nova confirmação. Documentação: https://formsubmit.co/documentation .

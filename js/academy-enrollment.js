(() => {
 const form = document.getElementById('academy-enrollment-form');
 if (!form) return;
 const course = form.querySelector('#en-course');
 const params = new URLSearchParams(window.location.search);
 if (params.get('curso') === 'excel') course.value = 'Excel para Análise de Dados';
 if (params.get('curso') === 'r') course.value = 'Programação em R';
 const status = document.getElementById('academy-status');
 const copyButton = document.getElementById('academy-copy');
 let lastMessage = '';
 const isEn = () => document.documentElement.lang === 'en';
 const buildMessage = () => {
   const d = new FormData(form);
   const get = k => String(d.get(k) || '').trim();
   return [
     'Pedido de inscrição — Kweva Academy',
     'Nome: ' + get('nome'),
     'E-mail: ' + get('email'),
     'Telefone / WhatsApp: ' + get('telefone'),
     'Cidade / Província: ' + (get('cidade') || '-'),
     'Curso: ' + get('curso'),
     'Nível: ' + get('nivel'),
     'Modalidade: ' + get('modalidade'),
     'Observações: ' + (get('observacoes') || '-')
   ].join('\n');
 };
 form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  lastMessage = buildMessage();
  const endpoint = form.dataset.endpoint?.trim();
  const email = form.dataset.email?.trim();
  copyButton.hidden = false;
  if (endpoint && /^https:\/\//i.test(endpoint)) {
    status.textContent = isEn() ? 'Sending request…' : 'A enviar pedido…';
    try {
      const payload = Object.fromEntries(new FormData(form));
      const res = await fetch(endpoint, {method: 'POST', headers: {'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(payload)});
      if(!res.ok) throw new Error('not sent');
      status.textContent = isEn() ? 'Request submitted successfully. The team will contact you.' : 'Pedido enviado com sucesso. A equipa entrará em contacto.';
      copyButton.hidden = true;
    } catch (e) {
      status.textContent = isEn() ? 'Unable to send automatically. Copy the request and contact the team.' : 'Não foi possível enviar automaticamente. Copie o pedido e contacte a equipa.';
    }
  } else if (email && !email.endsWith('@example.com')) {
    const subject = 'Pedido de inscrição — Kweva Academy';
    window.location.href='mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lastMessage);
    status.textContent = isEn() ? 'Your email application has been opened. Please send the message to finish the request.' : 'A sua aplicação de e-mail foi aberta. Conclua o envio para formalizar o pedido.';
  } else {
    status.textContent = isEn() ? 'Your request is prepared but has NOT been sent. Click “Copy request” and send it to Kweva through a contact channel.' : 'O pedido está preparado, mas NÃO foi enviado. Clique em “Copiar pedido” e partilhe-o com a Kweva por um canal de contacto.';
  }
 });
 copyButton.addEventListener('click', async () => {
  if(!lastMessage) return;
  try {
    await navigator.clipboard.writeText(lastMessage);
    status.textContent = isEn() ? 'Request copied. Send it to Kweva to complete the contact.' : 'Pedido copiado. Envie-o à Kweva para concluir o contacto.';
  } catch(e){
    const ta=document.createElement('textarea');ta.value=lastMessage;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');status.textContent=isEn()?'Request copied.':'Pedido copiado.';}catch(e2){status.textContent=lastMessage;}
    ta.remove();
  }
 });
})();
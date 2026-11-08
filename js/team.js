// Carrega os membros de data/team.json e mostra-os na página Team (PT/EN).
(function(){
 const grid=document.getElementById('team-grid');
 const placeholder=document.getElementById('team-placeholder');
 if(!grid)return;
 let members=[];
 const lang=()=>document.documentElement.lang==='en'?'en':'pt';
 const pick=(v,l)=>v&&typeof v==='object'?(v[l]||v.pt||v.en||''):(v||'');
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 const initials=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('');
 const contactIcon=kind=>{
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
  if(kind==='email'){
   svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');
   svg.innerHTML='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>';
  }else{
   svg.setAttribute('fill','currentColor');
   svg.innerHTML='<path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8v-4.64c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.72H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.53 2.79-1.53 2.98 0 3.58 1.96 3.58 4.51v5.27Z"/>';
  }
  return svg;
 };
 function render(){
  const l=lang();grid.querySelectorAll('dialog[open]').forEach(d=>d.close());document.body.classList.remove('profile-is-open');grid.replaceChildren();
  members.forEach(m=>{
   const card=el('article','person-card');
   const ph=el('div','person-photo');
   if(m.photo){const img=document.createElement('img');img.src=m.photo;img.alt=m.name;img.loading='lazy';ph.appendChild(img);}
   else ph.textContent=initials(m.name||'');
   const body=el('div','body');
   body.append(el('p','role',pick(m.role,l)),el('h3','',m.name||''));
   const links=el('p','person-links');
   if(m.email){
    const a=el('a','');
    a.href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(m.email);
    a.target='_blank';a.rel='noopener noreferrer';
    const label=l==='en'?'Email '+m.name+' via Gmail (opens in a new tab)':'Enviar e-mail a '+m.name+' pelo Gmail (abre num novo separador)';
    a.setAttribute('aria-label',label);a.title=label;
    a.append(contactIcon('email'));links.appendChild(a);
   }
   if(m.linkedin){const a=el('a','');a.href=m.linkedin;a.target='_blank';a.rel='noopener';a.append(contactIcon('linkedin'),el('span','','LinkedIn'));links.appendChild(a);}
   const contact=el('a','person-contact',l==='en'?'Contact':'Contacto');
   contact.href=m.phone?'https://wa.me/'+m.phone.replace(/\D/g,''):'contacto.html';
   if(m.phone){contact.target='_blank';contact.rel='noopener noreferrer';}
   links.appendChild(contact);
   body.appendChild(links);
   const more=el('button','person-more',l==='en'?'View full profile':'Ver mais');
   more.type='button';more.setAttribute('aria-haspopup','dialog');
   const details=el('dialog','person-dialog');
   const headingId='profile-name-'+members.indexOf(m);
   details.setAttribute('aria-labelledby',headingId);
   const panel=el('div','person-dialog-panel');
   const close=el('button','person-dialog-close','×');close.type='button';
   close.setAttribute('aria-label',l==='en'?'Close profile':'Fechar perfil');
   close.addEventListener('click',()=>details.close());
   const intro=el('div','person-dialog-intro');
   const portrait=ph.cloneNode(true);const identity=el('div','person-dialog-identity');
   const heading=el('h2','',m.name);heading.id=headingId;heading.tabIndex=-1;
   identity.append(el('p','role',pick(m.role,l)),heading,el('p','',pick(m.summary||m.bio,l)),links.cloneNode(true));
   intro.append(portrait,identity);panel.append(close,intro);
   more.addEventListener('click',()=>{details.showModal();document.body.classList.add('profile-is-open');heading.focus();});
   details.addEventListener('close',()=>{document.body.classList.remove('profile-is-open');more.focus();});
   details.addEventListener('click',event=>{if(event.target===details){const r=details.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)details.close();}});

   const content=el('div','person-profile-content');
   content.append(el('h4','',l==='en'?'Professional profile':'Percurso profissional'),el('p','',pick(m.bio,l)));
   (m.sections||[]).forEach(section=>{
    content.appendChild(el('h4','',pick(section.title,l)));
    const list=el('ul','person-timeline');
    (section.items||[]).forEach(item=>{
     const row=el('li','');
     if(item.period)row.appendChild(el('span','person-period',pick(item.period,l)));
     row.appendChild(el('strong','',pick(item.title,l)));
     if(item.description)row.appendChild(el('p','',pick(item.description,l)));
     list.appendChild(row);
    });
    content.appendChild(list);
   });
   panel.appendChild(content);details.appendChild(panel);body.append(more,details);
   card.append(ph,body);grid.appendChild(card);
  });
 }
 fetch('data/team.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).then(d=>{
  members=Array.isArray(d.members)?d.members:[];
  if(!members.length)return;
  if(placeholder)placeholder.hidden=true;
  render();
  document.addEventListener('kweva:languagechange',render);
 }).catch(()=>{/* sem JSON (ex.: ficheiro aberto sem servidor): mantém o texto de reserva */});
})();

// Carrega os membros de data/team.json e mostra-os na página Team (PT/EN).
(function(){
 const grid=document.getElementById('team-grid');
 const placeholder=document.getElementById('team-placeholder');
 if(!grid)return;
 let members=[];
 const lang=()=>{try{return localStorage.getItem('kweva-language')==='en'?'en':'pt';}catch(e){return 'pt';}};
 const pick=(v,l)=>v&&typeof v==='object'?(v[l]||v.pt||v.en||''):(v||'');
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 const initials=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('');
 function render(){
  const l=lang();grid.replaceChildren();
  members.forEach(m=>{
   const card=el('article','person-card');
   const ph=el('div','person-photo');
   if(m.photo){const img=document.createElement('img');img.src=m.photo;img.alt=m.name;img.loading='lazy';ph.appendChild(img);}
   else ph.textContent=initials(m.name||'');
   const body=el('div','body');
   body.append(el('p','role',pick(m.role,l)),el('h3','',m.name||''),el('p','',pick(m.bio,l)));
   const links=el('p','person-links');
   if(m.email){const a=el('a','',m.email);a.href='mailto:'+m.email;links.appendChild(a);}
   if(m.linkedin){const a=el('a','','LinkedIn');a.href=m.linkedin;a.target='_blank';a.rel='noopener';links.appendChild(a);}
   if(links.childNodes.length)body.appendChild(links);
   card.append(ph,body);grid.appendChild(card);
  });
 }
 fetch('data/team.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).then(d=>{
  members=Array.isArray(d.members)?d.members:[];
  if(!members.length)return;
  if(placeholder)placeholder.hidden=true;
  render();
  document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>setTimeout(render,0)));
 }).catch(()=>{/* sem JSON (ex.: ficheiro aberto sem servidor): mantém o texto de reserva */});
})();

// Ícones de redes sociais no rodapé, lidos de data/social.json (só aparecem as redes preenchidas).
(function(){
 const box=document.getElementById('social-links');const directories=[...document.querySelectorAll('[data-social-directory]')];if(!box&&!directories.length)return;
 const P={
  linkedin:['LinkedIn','<path d="M4.5 9h3.8v11H4.5zM6.4 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zM10.5 9h3.6v1.6c.6-1 1.9-1.9 3.8-1.9 3.6 0 4.1 2.4 4.1 5.4V20h-3.8v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.400-2 2.800V20h-3.900z"/>'],
  facebook:['Facebook','<path d="M14 8.5V6.800c0-.800.500-1 1-1h2V2h-3c-3 0-4.200 1.900-4.200 4.200v2.300H7.500V12h2.300v9.500H14V12h2.800l.4-3.500z"/>'],
  instagram:['Instagram','<path d="M7.500 2h9A5.500 5.500 0 0 1 22 7.500v9a5.500 5.500 0 0 1-5.500 5.500h-9A5.500 5.500 0 0 1 2 16.500v-9A5.500 5.500 0 0 1 7.500 2zm0 2A3.500 3.500 0 0 0 4 7.500v9A3.500 3.500 0 0 0 7.500 20h9a3.500 3.500 0 0 0 3.500-3.500v-9A3.500 3.500 0 0 0 16.500 4zM12 7.500a4.500 4.500 0 1 1 0 9 4.500 4.500 0 0 1 0-9zm0 2a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5zM17.300 5.800a1.100 1.100 0 1 1 0 2.200 1.100 1.100 0 0 1 0-2.200z"/>'],
  x:['X','<path d="M17.800 3h3.100l-6.800 7.700L22 21h-6.200l-4.900-6.300L5.300 21H2.200l7.300-8.300L2 3h6.400l4.400 5.800zm-1.100 16.200h1.700L7.400 4.700H5.600z"/>'],
  youtube:['YouTube','<path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z"/>'],
  whatsapp:['WhatsApp','<path d="M12 2a10 10 0 0 0-8.500 15.200L2 22l4.900-1.400A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.300 14.800l-.4-.2-2.800.8.800-2.700-.3-.4A8 8 0 0 1 12 4zm-3 3.500c-.3 0-.7.100-1 .5-.4.400-1 1.100-1 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.400 5.400 4.600 2.700 1 3.200.8 3.800.7.600-.1 1.900-.8 2.100-1.600.3-.8.300-1.400.2-1.500-.1-.2-.3-.3-.7-.5l-2-1c-.3-.1-.5-.1-.7.100l-.9 1.100c-.2.200-.3.200-.6.100-.3-.2-1.200-.4-2.300-1.400-.9-.8-1.400-1.700-1.600-2-.2-.3 0-.5.100-.6l.5-.6c.1-.2.200-.3.300-.5.100-.2 0-.4 0-.5l-.9-2.200c-.2-.5-.5-.5-.7-.5z"/>']
 };
 const featured=['linkedin','facebook','instagram','youtube','whatsapp'];
 const isSafe=(v,k)=>{try { const u=new URL(v);if(!['https:','http:'].includes(u.protocol))return false;
  if(k==='whatsapp')return u.hostname==='wa.me'||u.hostname==='api.whatsapp.com'||u.hostname==='www.whatsapp.com';
  return true;
 }catch(e){return false;}};
 const makeIcon=(k)=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">'+P[k][1]+'</svg>';
 fetch('data/social.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('social configuration missing');return r.json();}).then(d=>{
  let active=0;
  featured.forEach(k=>{
   const raw=typeof d[k]==='string'?d[k].trim():'';
   const url=(k==='whatsapp' && /^\+?[0-9\s()-]{8,}$/.test(raw))?'https://wa.me/'+raw.replace(/\D/g,''):raw;
   const valid=!!url&&isSafe(url,k);
   if(valid)active++;
   if(box){const wrap=document.createElement(valid?'a':'span');wrap.className=valid?'social-icon':'social-icon unavailable';wrap.title=P[k][0];wrap.setAttribute('aria-label',P[k][0]);if(!valid)wrap.setAttribute('role','img');if(valid){wrap.href=url;wrap.target='_blank';wrap.rel='noopener noreferrer';}wrap.innerHTML=makeIcon(k);box.appendChild(wrap);}
   directories.forEach(dir=>{const el=document.createElement(valid?'a':'div');el.className='social-directory-item'+(valid?'':' is-pending');el.title=P[k][0];el.setAttribute('aria-label',P[k][0]);if(!valid)el.setAttribute('role','img');if(valid){el.href=url;el.target='_blank';el.rel='noopener noreferrer';}el.innerHTML=makeIcon(k)+'<span>'+P[k][0]+'</span>';dir.appendChild(el);});
  });
  const note=document.querySelector('#social-note');if(note)note.hidden=true;
 }).catch(()=>{
  const note=document.querySelector('#social-note');if(note)note.hidden=true;
 });
})();

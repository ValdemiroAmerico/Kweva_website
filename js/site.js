const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});}
// The contact form uses an email draft until an official mail service is connected.
const form=document.querySelector('#contact-form');
if(form){form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const recipient=form.dataset.email;if(!recipient || recipient.endsWith('@example.com')){document.querySelector('#form-status').textContent=document.documentElement.lang==='en'?'The contact form is not available yet. We are setting up the institutional email.':'O contacto por formulário ainda não está disponível. Estamos a configurar o e-mail institucional.';return;}const body=`Nome: ${data.get('name')}\nOrganização: ${data.get('organisation')}\nE-mail: ${data.get('email')}\n\n${data.get('message')}`;location.href=`mailto:${recipient}?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent=document.documentElement.lang==='en'?'Your email application opened. Please complete the sending process.':'O seu programa de e-mail foi aberto para concluir o envio.';});}
const translationNodes=[];
const originalPageTitle=document.title.split(' | ')[0];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
while(walker.nextNode()){
 const node=walker.currentNode;
 if(node.parentElement?.closest('script,style'))continue;
 const original=node.nodeValue.trim();
 if(Object.prototype.hasOwnProperty.call(kwevaEnglish,original))translationNodes.push([node,node.nodeValue,kwevaEnglish[original]]);
}
const isEnglishNow=()=>document.documentElement.lang==='en';
const attrNames=['alt','aria-label','placeholder','title'];
const attrSuffixes=[[' — perfil pessoal provisório',' — temporary personal profile'],[' — em breve',' — coming soon']];
function translateAttrString(v){
 const t=v.trim(); if(Object.prototype.hasOwnProperty.call(kwevaEnglish,t))return kwevaEnglish[t];
 for(const [pt,en] of attrSuffixes){if(v.endsWith(pt))return v.slice(0,-pt.length)+en;}
 return v;
}
function translateAttributes(root,lang){
 (root.querySelectorAll?root.querySelectorAll('[alt],[aria-label],[placeholder],[title]'):[]).forEach(el=>attrNames.forEach(a=>{
  if(!el.hasAttribute(a))return; const key='ptOrig'+a.replace(/(^|-)(.)/g,(m,x,c)=>c.toUpperCase());
  if(el.dataset[key]===undefined)el.dataset[key]=el.getAttribute(a);
  const orig=el.dataset[key]; el.setAttribute(a,lang==='en'?translateAttrString(orig):orig);
 }));
}
const metaDesc=document.querySelector('meta[name="description"]');const metaDescPt=metaDesc?metaDesc.content:'';
const trackedNodes=new WeakSet(translationNodes.map(x=>x[0]));
function collectNewTextNodes(){
 const w2=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(w2.nextNode()){const n=w2.currentNode;if(trackedNodes.has(n)||n.parentElement?.closest('script,style'))continue;
  const o=n.nodeValue.trim();if(o&&Object.prototype.hasOwnProperty.call(kwevaEnglish,o)){translationNodes.push([n,n.nodeValue,kwevaEnglish[o]]);trackedNodes.add(n);}}
}
function setLanguage(lang){
 collectNewTextNodes();
 translationNodes.forEach(([node,original,english])=>{node.nodeValue=lang==='en'?original.replace(original.trim(),english):original;});
 document.documentElement.lang=lang==='en'?'en':'pt-MZ';
 translateAttributes(document,lang);
 if(metaDesc)metaDesc.content=lang==='en'?translateAttrString(metaDescPt):metaDescPt;
 const label=document.querySelector('.lang-label'); if(label) label.textContent=lang.toUpperCase();
 const pageNames={
  'Início':['Home','Início'],'Sobre':['About','Sobre'],
  'Serviços':['Services','Serviços'],'Projetos':['Projects','Projetos'],
  'Contacto':['Contact','Contacto'],'Team':['Team','Equipa'], 'Kweva Academy':['Kweva Academy','Kweva Academy'], 'Inscrição':['Enrolment','Inscrição'],'Página não encontrada':['Page not found','Página não encontrada']
 };
 if(pageNames[originalPageTitle])document.title=(lang==='en'?pageNames[originalPageTitle][0]:pageNames[originalPageTitle][1])+' | Kweva Research & Consulting';
 document.querySelectorAll('[data-language]').forEach(btn=>{const active=btn.dataset.language===lang;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
 try{localStorage.setItem('kweva-language',lang);}catch(error){}
}
document.querySelectorAll('[data-language]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.language)));
try{if(localStorage.getItem('kweva-language')==='en')setLanguage('en');}catch(error){}
// Texts and attributes inserted after load (social note, status messages, social icons) follow the active language.
new MutationObserver(muts=>{
 if(!isEnglishNow())return;
 muts.forEach(m=>m.addedNodes.forEach(n=>{
  const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);
  const nodes=n.nodeType===3?[n]:[];while(w.nextNode())nodes.push(w.currentNode);
  nodes.forEach(t=>{const o=t.nodeValue.trim();if(o&&Object.prototype.hasOwnProperty.call(kwevaEnglish,o)){translationNodes.push([t,t.nodeValue,kwevaEnglish[o]]);trackedNodes.add(t);t.nodeValue=t.nodeValue.replace(o,kwevaEnglish[o]);}});
  if(n.nodeType===1)translateAttributes(n,'en');
 }));
}).observe(document.body,{childList:true,subtree:true});


// Seletor de idioma (menu) e formulário de contacto do rodapé
(function(){
 const dd=document.querySelector('.lang-dd');
 if(dd){const cur=dd.querySelector('.lang-current'),lab=dd.querySelector('.lang-label');
  const sync=()=>{const l=document.documentElement.lang==='en'?'en':'pt';lab.textContent=l.toUpperCase();};
  const close=()=>{dd.classList.remove('open');cur.setAttribute('aria-expanded','false');};
  cur.addEventListener('click',e=>{e.stopPropagation();const o=dd.classList.toggle('open');cur.setAttribute('aria-expanded',String(o));});
  dd.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{sync();close();}));
  document.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});sync();}
 const bf=document.querySelector('#band-form');
 if(bf){bf.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(bf),to=bf.dataset.email,st=document.querySelector('#band-status');
  let en=false;try{en=localStorage.getItem('kweva-language')==='en';}catch(x){}
  if(!to || to.endsWith('@example.com')){st.textContent=en?'This form is not yet available. The official email is being configured.':'Este formulário ainda não está disponível. Estamos a configurar o e-mail institucional.';return;}
  const body=`Nome: ${d.get('name')}\nE-mail: ${d.get('email')}\nTelefone: ${d.get('phone')||'-'}\n\n${d.get('message')}`;
  location.href=`mailto:${to}?subject=${encodeURIComponent('Contacto através do site: '+d.get('name'))}&body=${encodeURIComponent(body)}`;
  st.textContent=en?'Your email app has opened to complete sending.':'O seu programa de e-mail foi aberto para concluir o envio.';});}
})();

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { platform } from '@/api/platformClient';
import PrivacyConsentNotice from '@/components/legal/PrivacyConsentNotice';
import useVisitorExperience from '@/hooks/useVisitorExperience';
import { MODELS, SECTORS, GOALS, modelById, sectorLabel, goalById, inferSector, rankModels, profileFromAudit, publicWebsite, buildBrief, contrastInk, verifiedTransmission } from '@/lib/webStudio.mjs';
import './web-studio.css';

function GoalPicker() {
  const {profile,updateProfile}=useVisitorExperience();
  return <div className="ws-goals" role="group" aria-label="Votre objectif principal">{GOALS.map(goal=><button type="button" key={goal.id} aria-pressed={profile.goal===goal.id} onClick={()=>updateProfile({goal:profile.goal===goal.id?'':goal.id})}>{goal.label}<span aria-hidden="true">↗</span></button>)}</div>;
}

function ProfilePanel({onReset}) {
  const {profile,updateProfile,resetProfile}=useVisitorExperience();
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [readInfo,setReadInfo]=useState(null);
  const sequence=useRef(0);
  const id=useId();
  useEffect(()=>()=>{sequence.current+=1;},[]);
  const reset=()=>{sequence.current+=1;setBusy(false);setMessage('');setReadInfo(null);resetProfile();onReset?.();};
  const detectDescription=()=>{
    const suggestion=inferSector(profile.activity);
    updateProfile({inferredSector:suggestion?.sector || '',evidence:suggestion?.evidence || []});
    setReadInfo(null);
    setMessage(suggestion ? 'Une activité est suggérée ci-dessous. Votre choix manuel reste prioritaire.' : 'Quelques mots ne suffisent pas à conclure. Choisissez votre activité dans la liste.');
  };
  const analyze=async()=>{
    if(busy)return;
    let url;
    try{url=publicWebsite(profile.website);}catch(error){setMessage(error.message);return;}
    const call=++sequence.current;
    setBusy(true);setMessage('');setReadInfo(null);
    let timer;
    try{
      const response=await Promise.race([
        platform.functions.invoke('analyzeSEO',{url}),
        new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('La lecture prend trop de temps. Précisez votre activité sans attendre l’analyse.')),35000);}),
      ]);
      if(call!==sequence.current)return;
      const result=profileFromAudit(response?.data);
      setReadInfo(result);
      updateProfile({website:url,inferredSector:result.detected?.sector || '',evidence:result.detected?.evidence || []});
      setMessage(result.detected ? 'Une activité possible a été repérée dans le contenu public. Confirmez-la ou corrigez-la.' : 'La page a été lue, mais son contenu ne permet pas de suggérer une activité avec assez de certitude.');
    }catch(error){if(call===sequence.current)setMessage(error.message || 'Lecture impossible. Choisissez votre activité manuellement.');}
    finally{clearTimeout(timer);if(call===sequence.current)setBusy(false);}
  };
  return <section className="ws-profile" aria-labelledby={`${id}-title`}>
    <div className="ws-section-heading"><div><span className="ws-kicker">VOTRE POINT DE DÉPART</span><h2 id={`${id}-title`}>Votre activité, pas celle de tout le monde.</h2></div><button type="button" className="ws-text-button" onClick={reset}>Réinitialiser mes choix</button></div>
    <div className="ws-fields">
      <label>Nom de votre entreprise<input autoComplete="organization" maxLength={80} value={profile.company} onChange={event=>updateProfile({company:event.target.value})} placeholder="Le nom à afficher dans les démos" /></label>
      <label>Votre activité<select value={profile.sector} onChange={event=>updateProfile({sector:event.target.value})}><option value="">À préciser / suggestion automatique</option>{SECTORS.map(sector=><option key={sector.id} value={sector.id}>{sector.label}</option>)}</select></label>
    </div>
    <details className="ws-disclosure"><summary>Aidez-moi à trouver ma direction</summary>
      <div className="ws-fields ws-fields-top">
        <div><label htmlFor={`${id}-activity`}>Décrivez votre activité<textarea id={`${id}-activity`} rows={3} maxLength={400} value={profile.activity} onChange={event=>updateProfile({activity:event.target.value})} placeholder="Par exemple : un restaurant avec une cuisine de saison et un service traiteur." /></label><button className="ws-button ws-button-quiet" type="button" onClick={detectDescription}>Suggérer une activité</button></div>
        <div><label htmlFor={`${id}-website`}>Adresse de votre site public<input id={`${id}-website`} inputMode="url" autoComplete="url" maxLength={300} disabled={busy} value={profile.website} onChange={event=>updateProfile({website:event.target.value})} placeholder="exemple.be" /></label><button className="ws-button ws-button-quiet" type="button" onClick={analyze} disabled={busy || !profile.website.trim()}>{busy?'Lecture en cours…':'Analyser ce site'}</button><p className="ws-note">Cette action demande au serveur de lire la page publique indiquée. Aucun compte client ni identité personnelle ne sont recherchés.</p></div>
      </div>
      <p className="ws-status" role="status">{message}</p>
      {readInfo&&<details className="ws-evidence"><summary>Ce qui a réellement été lu</summary><p><strong>{readInfo.title || 'Titre non disponible'}</strong></p><p>{readInfo.description || 'Description non disponible.'}</p><p className="ws-note">Source : {readInfo.sourceUrl}. Lecture du HTML initial uniquement, pas des contenus ajoutés ensuite par JavaScript.</p></details>}
    </details>
    {profile.inferredSector&&<div className="ws-detection"><span>{profile.sector?'Votre choix prévaut sur la suggestion':'Activité possible, à confirmer'} : <strong>{sectorLabel(profile.inferredSector)}</strong>{profile.evidence.length>0&&<small>Indices : {profile.evidence.join(', ')}.</small>}</span><button type="button" className="ws-button ws-button-quiet" onClick={()=>updateProfile({sector:profile.inferredSector})}>Utiliser cette activité</button></div>}
    <label className="ws-remember"><input type="checkbox" checked={profile.remember} onChange={event=>updateProfile({remember:event.target.checked})} /><span>Mémoriser mes choix sur cet appareil pendant 30 jours.<small>Uniquement l’activité choisie, l’objectif, le modèle et la couleur. Ni le nom de l’entreprise, ni l’adresse analysée.</small></span></label>
    <p className="ws-note">Sans mémorisation, vos choix restent dans cette visite. Les suggestions suivent vos choix et vos aperçus, pas un profil caché.</p>
  </section>;
}

export function DemoSite({model,profile={},thumbnail=false,logo=''}) {
  const [tab,setTab]=useState(0);
  const [confirmed,setConfirmed]=useState(false);
  const id=useId();
  const accent=profile.accent || model.accent;
  const company=profile.company || model.name;
  const style={'--demo-accent':accent,'--demo-bg':model.background,'--demo-ink':model.tone==='light'?'#202323':'#FFFFFF','--demo-button-ink':contrastInk(accent)};
  const content=[
    {title:model.sections[0],text:'Présentez ici votre sélection, vos services ou vos réalisations. La structure s’adapte à votre activité et à vos contenus.'},
    {title:model.sections[1],text:'Un parcours clair pour découvrir votre univers, comprendre votre offre et préparer la prochaine étape.'},
    {title:model.sections[2],text:'Gardez le lien avec vos visiteurs grâce à une prise de contact simple et une réponse humaine.'},
  ];
  return <div className={`ws-demo ${thumbnail?'ws-demo-mini':''}`} data-layout={model.layout} data-tone={model.tone} style={style}>
    <div className="ws-demo-nav"><strong>{logo&&<img src={logo} alt="" />}{company}</strong><span>{sectorLabel(model.sector)}</span></div>
    <div className="ws-demo-hero"><div className="ws-demo-copy"><span className="ws-demo-eyebrow">{profile.company?'VOTRE UNIVERS':'CONCEPT'} / {model.name}</span><h3>{model.headline}</h3><p>{profile.activity || model.description}</p>{thumbnail?<span className="ws-demo-cta">Découvrir <b aria-hidden="true">↗</b></span>:<button type="button" className="ws-demo-cta" onClick={()=>{setTab(0);document.getElementById(`${id}-content`)?.scrollIntoView({behavior:'auto',block:'nearest'});}}>Découvrir <b aria-hidden="true">↗</b></button>}</div><div className="ws-demo-art" aria-hidden="true"><i/><i/><i/><i/><span>{model.name.slice(0,1)}</span></div></div>
    <div className="ws-demo-tabs" role={thumbnail?undefined:'group'} aria-label={thumbnail?undefined:'Rubriques de la démo'}>{model.sections.map((label,index)=>thumbnail?<span key={label}>{label}</span>:<button type="button" aria-pressed={tab===index} key={label} onClick={()=>{setTab(index);setConfirmed(false);}}>{label}</button>)}</div>
    {!thumbnail&&<div className="ws-demo-content" id={`${id}-content`}><span className="ws-demo-eyebrow">DÉMONSTRATION INTERACTIVE / 0{tab+1}</span><h4>{content[tab].title}</h4><p>{content[tab].text}</p>{tab<2?<div className="ws-demo-tiles">{['Une offre lisible','Un parcours simple','Votre touche personnelle'].map((label,index)=><div key={label}><span>0{index+1}</span><strong>{label}</strong><p>Contenu de démonstration à remplacer par vos informations.</p></div>)}</div>:<form className="ws-demo-form" onSubmit={event=>{event.preventDefault();setConfirmed(true);}}><label>Message d’essai<input maxLength={120} placeholder="Ne saisissez aucune donnée personnelle" /></label><button type="submit" className="ws-demo-cta">Tester le parcours</button><p role="status">{confirmed?'Test terminé : rien n’a été envoyé.':'Ceci est une démo : aucun envoi, paiement ou rendez-vous.'}</p></form>}</div>}
  </div>;
}

function ModelCard({model,profile,onPreview,onChoose,recommended=false}) {
  return <article className="ws-card"><div className="ws-card-browser"><span/><span/><span/><small>concept / {model.id}</small></div><div className="ws-card-visual" aria-hidden="true"><DemoSite model={model} profile={profile} thumbnail /></div><div className="ws-card-info"><div><span className="ws-kicker">{sectorLabel(model.sector)}</span><h3>{model.name} <small>{{editorial:'Éditorial',tech:'Digital',poster:'Affiche',craft:'Matière',architecture:'Architecture',community:'Collectif'}[model.layout]}</small></h3></div>{recommended&&<span className="ws-match">À explorer</span>}</div>{recommended&&<p className="ws-reason">{model.reasons.slice(0,2).join(' · ')}</p>}<div className="ws-card-actions"><button type="button" className="ws-button ws-button-quiet" onClick={event=>onPreview(model,event.currentTarget)} aria-label={`Voir la démo ${model.name}`}>Voir la démo ↗</button><button type="button" className="ws-text-button" onClick={()=>onChoose(model)} aria-label={`Choisir le style ${model.name}`}>{profile.model===model.id?'Style choisi ✓':'Choisir ce style'}</button></div></article>;
}

export function AdaptiveHero() {
  const {profile,updateProfile}=useVisitorExperience();
  const goal=goalById(profile.goal);
  const model=modelById(profile.model) || rankModels(profile)[0];
  const [settings,setSettings]=useState(false);
  return <div className="ws-experience"><section className="ws-home-hero"><div className="ws-orbit" aria-hidden="true"/><div className="ws-home-copy"><span className="ws-kicker"><i/> JS-Innov.IA / EXPÉRIENCES INTELLIGENTES</span><h1>{goal?goal.title:<>Votre ambition.<br/>Une expérience <em>à part.</em></>}</h1><p className="ws-lead">{goal?goal.description:'Sites vivants, automatisations et assistants IA : partons de votre besoin pour créer ce qui vous sera vraiment utile.'}</p><span className="ws-label">Aujourd’hui, vous souhaitez…</span><GoalPicker/><div className="ws-hero-actions"><Link className="ws-button ws-button-gold" to={goal?.href || '/web-studio'}>{goal?.cta || 'Imaginer mon futur site'} <span aria-hidden="true">↗</span></Link><button type="button" className="ws-text-button" aria-expanded={settings} onClick={()=>setSettings(!settings)}>Personnaliser mon parcours</button></div><p className="ws-note" role="status">{profile.sector?`Parcours orienté ${sectorLabel(profile.sector).toLowerCase()}.`:'Vous gardez la main. Choisissez un objectif pour adapter cette page.'} Les autres solutions restent accessibles.</p></div><div className="ws-home-stage"><div className="ws-floating-label">{profile.company?`Projection pour ${profile.company}`:'Un aperçu de votre prochain site'}<span>PERSONNALISABLE</span></div><div className="ws-home-browser"><div className="ws-card-browser"><span/><span/><span/><small>Web Studio / {model.name}</small></div><DemoSite model={model} profile={profile} thumbnail /></div><div className="ws-home-caption"><span>18 concepts · 6 compositions · Votre identité</span><Link to="/web-studio" onClick={()=>updateProfile({model:model.id})}>Explorer ce style ↗</Link></div></div></section>{settings&&<div className="ws-container"><ProfilePanel/></div>}<section className="ws-pathway ws-container" aria-label="Votre parcours conseillé"><span className="ws-kicker">UNE DIRECTION, PAS UNE CASE</span><div className="ws-pathway-grid">{[goal || GOALS[0],...GOALS.filter(item=>item.id!==(goal?.id || 'web')).slice(0,2)].map((item,index)=><Link key={item.id} to={item.href} className="ws-pathway-card" onClick={()=>updateProfile({goal:item.id})}><span>0{index+1} / {index===0&&goal?'VOTRE PRIORITÉ':'À DÉCOUVRIR'}</span><h2>{item.label}</h2><p>{item.description}</p><b aria-hidden="true">↗</b></Link>)}</div></section></div>;
}

function StudioRequestForm({brief}) {
  const [contact,setContact]=useState({name:'',email:'',phone:'',company:brief.company || ''});
  const [message,setMessage]=useState('');
  const [consent,setConsent]=useState(false);
  const [status,setStatus]=useState('idle');
  const [error,setError]=useState('');
  const [proof,setProof]=useState(null);
  const attempt=useRef(null);
  const pending=useRef(false);
  const mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const submit=async event=>{
    event.preventDefault();
    if(pending.current || proof || !consent || !contact.name.trim() || !contact.email.trim())return;
    const payload={contact:{...contact,name:contact.name.trim(),email:contact.email.trim()},messages:[{role:'user',content:buildBrief(brief)+(message.trim()?'\n\nPrécisions du client : '+message.trim():'')}],consent:true,source:'web_studio'};
    const signature=JSON.stringify(payload);
    if(attempt.current?.signature!==signature)attempt.current={signature,key:window.crypto.randomUUID()};
    pending.current=true;setStatus('loading');setError('');
    let timer;
    try{
      const response=await Promise.race([
        platform.functions.invoke('submitElyneaRequest',{...payload,idempotency_key:attempt.current.key}),
        new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('confirmation-timeout')),45000);}),
      ]);
      const received=verifiedTransmission(response?.data);
      if(mounted.current){setProof(received);setStatus('success');}
    }catch{if(mounted.current){setStatus('error');setError('Aucune confirmation vérifiée n’a été reçue. Réessayez avec les mêmes informations : la même référence technique sera réutilisée pour limiter les doublons.');}}
    finally{clearTimeout(timer);pending.current=false;}
  };
  if(proof)return <div className="ws-confirmed" role="status"><h3>Demande enregistrée.</h3><p>Référence Cockpit : <strong>{proof.request_id}</strong></p><p>Aucun devis, e-mail ou rendez-vous n’a été créé automatiquement. Votre demande est prête pour le suivi par l’équipe JS-Innov.IA.</p></div>;
  return <form className="ws-request-form" onSubmit={submit}>
    <div className="ws-fields"><label>Votre nom<input required autoComplete="name" maxLength={100} value={contact.name} onChange={event=>setContact({...contact,name:event.target.value})}/></label><label>Votre e-mail<input required type="email" autoComplete="email" maxLength={254} value={contact.email} onChange={event=>setContact({...contact,email:event.target.value})}/></label></div>
    <label>Téléphone, facultatif<input type="tel" autoComplete="tel" maxLength={50} value={contact.phone} onChange={event=>setContact({...contact,phone:event.target.value})}/></label>
    <label>Vos précisions, facultatif<textarea rows={4} maxLength={1500} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Ce qui compte pour vous, les fonctions souhaitées, vos questions…"/></label>
    <label className="ws-remember"><input type="checkbox" required checked={consent} onChange={event=>setConsent(event.target.checked)}/><PrivacyConsentNotice/></label>
    {error&&<p role="alert" className="ws-status">{error}</p>}
    <button className="ws-button ws-button-gold" type="submit" disabled={status==='loading' || !consent || !contact.name.trim() || !contact.email.trim()}>{status==='loading'?'Transmission en cours…':'Envoyer ma demande à JS-Innov.IA'}</button>
    <p className="ws-note">L’envoi porte sur ce récapitulatif et vos coordonnées, uniquement après votre validation. Une confirmation nécessite une référence vérifiée du Cockpit.</p>
  </form>;
}

export default function WebStudio() {
  const {profile,updateProfile}=useVisitorExperience();
  const [filter,setFilter]=useState('');
  const [search,setSearch]=useState('');
  const [preview,setPreview]=useState(null);
  const [device,setDevice]=useState('desktop');
  const [logo,setLogo]=useState('');
  const [notice,setNotice]=useState('');
  const [brief,setBrief]=useState(null);
  const opener=useRef(null);
  const fileRef=useRef(null);
  const logoSequence=useRef(0);
  const ranked=useMemo(()=>rankModels(profile),[profile]);
  const visible=ranked.filter(model=>(!filter || model.sector===filter) && `${model.name} ${sectorLabel(model.sector)}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')));
  const personalized=Boolean(profile.sector || profile.inferredSector || profile.goal || profile.model || profile.previewed.length);
  useEffect(()=>{const previous=document.title;document.title='Web Studio — Votre site à votre image | JS-Innov.IA';return()=>{document.title=previous;logoSequence.current+=1;};},[]);
  const choose=model=>{updateProfile({model:model.id});setNotice(`Style ${model.name} sélectionné. Vous pouvez le personnaliser et préparer votre demande.`);};
  const openPreview=(model,button)=>{opener.current=button;setPreview(model);setDevice('desktop');updateProfile({previewed:[...profile.previewed.filter(id=>id!==model.id),model.id]});};
  const loadLogo=event=>{
    const file=event.target.files?.[0];if(!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size>2*1024*1024){setNotice('Utilisez un logo PNG, JPEG ou WebP de moins de 2 Mo.');event.target.value='';return;}
    const token=++logoSequence.current;
    const reader=new FileReader();
    reader.onload=()=>{const image=new Image();image.onload=()=>{if(token!==logoSequence.current)return;try{const canvas=document.createElement('canvas');const ratio=Math.min(1,512/Math.max(image.width,image.height));canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);setLogo(canvas.toDataURL('image/png'));setNotice('Logo chargé uniquement dans cet aperçu. Il n’est ni envoyé ni mémorisé.');}catch{setNotice('Ce logo ne peut pas être utilisé. Essayez un autre fichier.');}};image.onerror=()=>{if(token===logoSequence.current)setNotice('Image illisible. Utilisez un autre logo.');};image.src=String(reader.result);};
    reader.onerror=()=>{if(token===logoSequence.current)setNotice('Le fichier n’a pas pu être lu.');};reader.readAsDataURL(file);
  };
  const clearLogo=()=>{logoSequence.current+=1;setLogo('');if(fileRef.current)fileRef.current.value='';};
  const prepareBrief=()=>{const snapshot={...profile,model:profile.model || ranked[0].id};updateProfile({model:snapshot.model});setPreview(null);setBrief(snapshot);setTimeout(()=>document.getElementById('ws-request')?.scrollIntoView({behavior:'auto',block:'start'}),0);};
  const share=async()=>{const url=new URL('/web-studio',window.location.origin);if(profile.sector)url.searchParams.set('secteur',profile.sector);if(profile.goal)url.searchParams.set('objectif',profile.goal);if(profile.model)url.searchParams.set('modele',profile.model);try{await navigator.clipboard.writeText(url.href);setNotice('Lien de style copié, sans nom, logo ni adresse de site client.');}catch{setNotice(`Lien à copier : ${url.href}`);}};
  const downloadBrief=()=>{const url=URL.createObjectURL(new Blob([buildBrief(profile)],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='mon-projet-web-studio.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  return <div className="ws-experience ws-studio-page"><header className="ws-studio-intro ws-container"><div><span className="ws-kicker"><i/> JS-Innov.IA / WEB STUDIO</span><h1>Ne choisissez pas un site.<br/><em>Reconnaissez le vôtre.</em></h1><p className="ws-lead">18 concepts originaux. Des démos à explorer. Une direction qui évolue avec votre activité, vos besoins et vos choix.</p></div><a className="ws-button ws-button-gold" href="#ws-collection">Explorer la collection ↗</a></header><div className="ws-container"><GoalPicker/><ProfilePanel onReset={()=>{clearLogo();setBrief(null);setFilter('');setSearch('');setNotice('Choix réinitialisés.');}}/>
    <section className="ws-recommendations" aria-labelledby="ws-recommended"><div className="ws-section-heading"><div><span className="ws-kicker">{personalized?'VOTRE SÉLECTION ÉVOLUE':'POUR COMMENCER'}</span><h2 id="ws-recommended">{personalized?'Trois directions à explorer.':'Trois univers, trois points de départ.'}</h2></div><span className="ws-note">Suggestions par critères explicites, pas une identification du visiteur.</span></div><div className="ws-grid ws-grid-three">{ranked.slice(0,3).map(model=><ModelCard key={model.id} model={model} profile={profile} onPreview={openPreview} onChoose={choose} recommended/>)}</div></section>
    <section className="ws-customize" aria-label="Personnalisation de votre aperçu"><div><span className="ws-kicker">VOTRE TOUCHE</span><h2>{profile.model?`Direction ${modelById(profile.model).name}`:'Essayez votre identité'}</h2></div><label className="ws-color-label">Couleur d’accent<input type="color" value={profile.accent || modelById(profile.model)?.accent || ranked[0].accent} onChange={event=>updateProfile({accent:event.target.value})}/></label><button className="ws-text-button" type="button" onClick={()=>updateProfile({accent:''})}>Couleurs du modèle</button><label className="ws-file-label ws-button ws-button-quiet">Ajouter mon logo<input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={loadLogo}/></label>{logo&&<><img className="ws-logo-mini" src={logo} alt="Votre logo, local à cette visite"/><button type="button" className="ws-text-button" onClick={clearLogo}>Retirer</button></>}<button className="ws-button ws-button-gold" type="button" onClick={prepareBrief}>Préparer ma demande ↗</button></section>
    <p className="ws-status" role="status">{notice}</p>
    <section id="ws-collection" aria-labelledby="ws-collection-title"><div className="ws-section-heading"><div><span className="ws-kicker">LA COLLECTION COMPLÈTE</span><h2 id="ws-collection-title">Toutes les possibilités restent ouvertes.</h2></div><label className="ws-search">Rechercher un concept<input type="search" value={search} maxLength={80} placeholder="Nom ou activité" onChange={event=>setSearch(event.target.value)}/></label></div><div className="ws-filters" role="group" aria-label="Filtrer par activité"><button type="button" aria-pressed={!filter} onClick={()=>setFilter('')}>Tous · {MODELS.length}</button>{SECTORS.map(sector=><button type="button" key={sector.id} aria-pressed={filter===sector.id} onClick={()=>setFilter(sector.id)}>{sector.label}</button>)}</div><p className="ws-note" role="status">{visible.length} concept{visible.length>1?'s':''} affiché{visible.length>1?'s':''}. Les aperçus sont des concepts, pas des sites clients livrés.</p><div className="ws-grid">{visible.map(model=><ModelCard key={model.id} model={model} profile={profile} onPreview={openPreview} onChoose={choose}/>)}</div>{!visible.length&&<p className="ws-empty">Aucun concept ne correspond à ces filtres. <button type="button" className="ws-text-button" onClick={()=>{setFilter('');setSearch('');}}>Afficher toute la collection</button></p>}</section>
    <section className="ws-next"><div><span className="ws-kicker">LE DESIGN N’EST QUE LE DÉBUT</span><h2>Votre site. Votre façon de travailler.</h2><p>Les fonctions — prise de rendez-vous, catalogue, assistant ou espace client — se définissent avec vous. Les aperçus ne simulent aucun achat, aucune réservation réelle ni aucun résultat commercial.</p></div><div className="ws-next-actions"><button type="button" className="ws-button ws-button-gold" onClick={prepareBrief}>Construire mon projet ↗</button><button type="button" className="ws-button ws-button-quiet" onClick={share}>Partager ce style</button><button type="button" className="ws-text-button" onClick={downloadBrief}>Exporter mon brief</button></div></section>
    {brief&&<section id="ws-request" className="ws-request"><h2>Votre demande, avant tout envoi.</h2><pre>{buildBrief(brief)}</pre><p className="ws-note">Ce récapitulatif est ajouté au message. Le formulaire n’envoie rien avant votre validation. Votre logo reste local et n’est pas joint.</p><StudioRequestForm key={JSON.stringify(brief)} brief={brief} /></section>}
    </div>
    <Dialog.Root open={Boolean(preview)} onOpenChange={open=>{if(!open)setPreview(null);}}><Dialog.Portal><Dialog.Overlay className="ws-dialog-overlay"/><Dialog.Content className="ws-experience ws-dialog" onCloseAutoFocus={event=>{event.preventDefault();opener.current?.focus();}}><div className="ws-dialog-heading"><div><Dialog.Title>{preview?.name} / votre aperçu</Dialog.Title><Dialog.Description>Changez de format et explorez les rubriques. Rien n’est publié ni envoyé depuis cette démo.</Dialog.Description></div><Dialog.Close asChild><button type="button" className="ws-close" aria-label="Fermer l’aperçu">×</button></Dialog.Close></div><div className="ws-device-bar" role="group" aria-label="Format de l’aperçu">{[['desktop','Ordinateur'],['tablet','Tablette'],['mobile','Téléphone']].map(([value,label])=><button key={value} type="button" aria-pressed={device===value} onClick={()=>setDevice(value)}>{label}</button>)}<button type="button" className="ws-button ws-button-gold" onClick={()=>{if(preview)choose(preview);setPreview(null);}}>Choisir ce style</button></div><div className="ws-demo-scroll"><div className="ws-device-frame" data-device={device}>{preview&&<DemoSite key={preview.id} model={preview} profile={profile} logo={logo}/>}</div></div></Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
}
